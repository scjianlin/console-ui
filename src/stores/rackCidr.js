
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'

import { LIST_DEFAULT_ORDER, API_VERSIONS } from 'utils/constants'

import List from './base.list'

export default class RackStore {
  list = new List()

  @observable
  addrList = []

  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  isSubmitting = false

  module = "getRackCidr"

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

    const result = await request.get('sailor/getRackCidr',params)
    const data = (result.items !== null ? result.items.map(this.mapper) : [] )

    //  获取机柜IP信息
    for (let i=0;i<data.length;i++) {
      for (let j=0;j<data[i].hostAddr.length;j++) {
        let state = (data[i].hostAddr[j].useState === 0)  //获取未使用的node列表
        if (state) {
          this.addrList.push({
            label: data[i].hostAddr[j].ipAddr + "-" + data[i].rackTag,
            value: data[i].hostAddr[j].ipAddr,
            rackTag: data[i].rackTag
          })
        }
      }
    }

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
    return this.submitting(request.post('sailor/addRackCidr', data))
  }

  @action
  patch(params, newObject) {
    return this.submitting(request.post('sailor/updateRackCidr', newObject))
  }

  @action
  delete(data,params={}) {
    return this.submitting(request.delete('sailor/delRackCidr', data))
  }

  reject = res => {
    this.isSubmitting = false
    window.onunhandledrejection(res)
  }
}