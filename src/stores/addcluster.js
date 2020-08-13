
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'
import List from './base.list'

export default class AddClusterStore {
  list = new List()

  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  isSubmitting = false

  module = "AddCluster"

  get mapper() {
    return ObjectMapper[this.module] || (data => data)
  }

  @action
  setModule(module) {
    this.module = module
  }

  @action
  submitting = promise => {
    this.isSubmitting = true

    setTimeout(() => {
      promise
        .catch(() => {})
        .finally(() => {
          this.isSubmitting = false
        })
    }, 500)

    return promise
  }

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
    
    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 9
    params.page = params.page || 1

    const result = await request.get('sailor/getClusterList',params)
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

  @action  
  setSelectRowKeys(selectedRowKeys) {
    this.list.selectedRowKeys.replace(selectedRowKeys)
  }

  @action
  create(data, params = {}) {
    console.log("data=>",data);
    return this.submitting(request.post('sailor/addCluster', data))
  }

  @action
  delete(data,params={}) {
    return this.submitting(request.delete('sailor/delCluster', data))
  }

  reject = res => {
    this.isSubmitting = false
    window.onunhandledrejection(res)
  }
}