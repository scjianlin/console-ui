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

import Base from 'stores/base'
import { action } from 'mobx'

export default class LimitRangeStore extends Base {
  module = 'limitranges'

  list = new List()

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
    // const result = await request.get(
    //   this.getResourceUrl({ cluster, workspace, namespace, devops }),
    //   this.getFilterParams(params)
    // )
    // const data = get(result, 'items', []).map(item => ({
    //   cluster,
    //   ...this.mapper(item),
    // }))
    const data = []
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
  async fetchListByK8s({ cluster, namespace, module, ...rest } = {}) {
    console.log("aaaaa");

    this.list.isLoading = true

    if (module) {
      this.module = module
    }

    const params = rest

    // const result = await request.get(
    //   this.getListUrl({ cluster, namespace, module }),
    //   params
    // )

    // const data = result.items.map(item => ({
    //   cluster,
    //   module: module || this.module,
    //   ...this.mapper(item),
    // }))

    const data = []

    this.list.update({
      data,
      total: result.items.length,
      isLoading: false,
    })

    return data
  }  
}