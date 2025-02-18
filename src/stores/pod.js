/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

 import {get} from 'lodash'
import { action } from 'mobx'
import { isEmpty } from 'lodash'
import { getWorkloadVolumes } from 'utils/workload'
import Base from './base'
import { LIST_DEFAULT_ORDER, API_VERSIONS } from 'utils/constants'

export default class PodStore extends Base {
  module = 'pods'

  getResourceUrl = (params = {}) =>
    `sailor${this.getPath(params)}/${
      this.module
  }`

  @action
  async fetchDetail({ cluster, namespace, name, silent }) {
    if (!silent) {
      this.isLoading = true
    }

    const result = await request.get(
      this.getDetailUrl({ cluster, namespace, name })
    )
    const detail = this.mapper(result)

    detail.cluster = cluster
    detail.volumes = await getWorkloadVolumes(detail)

    if (!isEmpty(detail.volumes)) {
      detail.containers.forEach(container => {
        if (!isEmpty(container.volumeMounts)) {
          container.volumeMounts.forEach(volumeMount => {
            const volume = detail.volumes.find(
              _volume => _volume.name === volumeMount.name
            )
            if (!isEmpty(volume)) {
              volume.containers = volume.containers || []
              volume.containers.push(container)
            }
          })
        }
      })
    }

    this.detail = detail

    if (!silent) {
      this.isLoading = false
    }

    return detail
  }

  @action
  async fetchList({
    cluster,
    workspace,
    namespace,
    more,
    devops,
    ...params
  } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      this.getResourceUrl({ cluster, workspace, namespace, devops }),
      this.getFilterParams(params)
    )
    const data = get(result, 'items', []).map(item => ({
      cluster,
      ...this.mapper(item),
    }))

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return data
  }

}
