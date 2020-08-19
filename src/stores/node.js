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

import { action, observable } from 'mobx'
import { get} from 'lodash'

import { getNodeRoles } from 'utils/node'
import List from './base.list'
import { LIST_DEFAULT_ORDER, API_VERSIONS } from 'utils/constants'

import Base from './base'

export default class NodeStore extends Base {
  list = new List()

  @observable
  nodesMetrics = []

  @observable
  nodeMetrics = {}

  @observable
  masterCount = 0

  @observable
  masterWorkerCount = 0

  @observable
  nodeRole = null

  module = 'nodes'

  getFilterParams = (params,cluster) => {
    const result = { ...params }
    if (result.role) {
      result.labelSelector = result.labelSelector || ''
      result.labelSelector += `node-role.kubernetes.io/${result.role}=`
      delete result.role
    }
    if (cluster) {
      result.clusterName = cluster.clusterName
    }
    return result
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
      `sailor/getNodeCount`,
      this.getFilterParams(params,{'clusterName':cluster}),
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

  @action
  async fetchCount(params) {
    const resp = await request.get(`sailor/getClusterCounts`,{'clusterName': params.cluster})
    this.masterCount = resp.items.masterCount
    this.masterWorkerCount =  resp.items.masterWorkerCount
    this.nodeRole = params.cluster
  }

  @action
  async batchPatchTaints(nodes) {
    await this.submitting(
      Promise.all(
        nodes.map(node => {
          const newTaints = node.taints
          return request.patch(this.getDetailUrl(node), {
            spec: { taints: newTaints },
          })
        })
      )
    )
  }

  @action
  async cordon({ cluster, name }) {
    const data = {
      spec: { unschedulable: true },
    }
    const result = await request.patch(
      this.getDetailUrl({ cluster, name }),
      data
    )

    this.detail = this.mapper(result)
    this.originDetail = result
  }

  @action
  async uncordon({ cluster, name }) {
    const data = {
      spec: { unschedulable: null },
    }
    const result = await request.patch(
      this.getDetailUrl({ cluster, name }),
      data
    )

    this.detail = this.mapper(result)
    this.originDetail = result
  }

  @action
  async deleteSelected(rowKeys) {
    await Promise.all(
      rowKeys.map(rowKey => {
        const node = this.list.data[rowKey]
        if (node.role === 'master') return null

        return request.delete(this.getDetailUrl(node), {
          orphanDependents: false,
        })
      })
    )
    this.list.selectedRowKeys = []
  }
}
