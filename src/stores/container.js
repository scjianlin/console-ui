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

import { observable, action } from 'mobx'
import { get } from 'lodash'

import ObjectMapper from 'utils/object.mapper'
import { getWorkloadVolumes } from 'utils/workload'

export default class ContainerStore {
  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  volumes = []

  @observable
  logs = {
    data: '',
    isLoading: true,
  }

  watchHandler = null

  @action
  async fetchDetail({ namespace, podName, containerName }) {
    this.isLoading = true

    const result = await request.get(
      `api/v1/namespaces/${namespace}/pods/${podName}`
    )
    const pod = ObjectMapper.pods(result)
    const detail =
      pod.containers.find(item => item.name === containerName) ||
      pod.initContainers.find(item => item.name === containerName)
    detail.createTime = get(pod, 'createTime', '')
    detail.app = detail.app || pod.app

    this.volumes = await getWorkloadVolumes(pod)

    this.detail = detail
    this.isLoading = false
  }

  @action
  async watchLogs({ namespace, podName, silent, ...params }, callback) {
    if (!silent) {
      this.logs.isLoading = true
    }

    if (params.follow) {
      this.watchHandler = request.watch(
        `/api/v1/namespaces/${namespace}/pods/${podName}/log`,
        params,
        data => {
          this.logs = {
            data,
            isLoading: false,
          }
          callback()
        }
      )
    } else {
      const result = await request.get(
        `api/v1/namespaces/${namespace}/pods/${podName}/log`,
        params
      )

      this.logs = {
        data: result,
        isLoading: false,
      }

      callback()
    }
  }

  @action
  stopWatchLogs() {
    this.watchHandler && this.watchHandler.abort()
  }

  @action
  async fetchAllLogs({ namespace, podName, ...params }) {
    return await request.get(
      `api/v1/namespaces/${namespace}/pods/${podName}/log`,
      params
    )
  }

  @action
  getDockerImagesLists = async params =>
    await request.get(
      `dockerhub/api/content/v1/products/search`,
      params,
      {
        headers: {
          'Search-Version': 'v3',
        },
      },
      () => {}
    )

  @action
  getImageDetail = async params => {
    const result = await request.get(
      `kapis/resources.kubesphere.io/v1alpha2/registry/blob`,
      params,
      null,
      e => e
    )

    if (get(result, 'status', 'succeeded') !== 'succeeded') {
      result.status = 'failed'
    }
    return ObjectMapper.imageBlob(result)
  }
}
