
import { action } from 'mobx'
// import ObjectMapper from 'utils/object.mapper'

import List from './base.list'

export default class ClusterVersion {
  list = new List()

  module = "getClusterVersion"

  @action
  async fetchList({
    cluster,
    workspace,
    namespace,
    more,
    resources = [],
    devops,
    ...params
  } = {}) {
    this.list.isLoading = true

    const result = await request.get('sailor/getClusterVersion')

    const data = result.items

    this.list.update({
      data: data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 9,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })
    return data
  }
}