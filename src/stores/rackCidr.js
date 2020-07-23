
import { get, isEmpty } from 'lodash'
import { action, observable } from 'mobx'
import ObjectMapper from 'utils/object.mapper'

import { LIST_DEFAULT_ORDER, API_VERSIONS } from 'utils/constants'

import List from './base.list'

export default class RackStore {
  list = new List()

  @observable
  detail = {}

  @observable
  isLoading = true

  @observable
  isSubmitting = false

  module = "getRackCidr"

  get apiVersion() {
    return API_VERSIONS[this.module] || ''
  }

  get mapper() {
    return ObjectMapper[this.module] || (data => data)
  }

  getPath({ cluster, namespace } = {}) {
    let path = ''
    if (cluster) {
      path += `/klusters/${cluster}`
    }
    if (namespace) {
      path += `/namespaces/${namespace}`
    }
    return path
  }

  getAddUrl = () => `sailor/addRackCidr`

  getDeleteUrl = () => `sailor/delRackCidr`

  // getDetailUrl = (params = {}) => `${this.getListUrl(params)}/${params.name}`

  getWatchListUrl = (params = {}) =>
    `${this.apiVersion}/watch${this.getPath(params)}/${this.module}`

  getWatchUrl = (params = {}) =>
    `${this.getWatchListUrl(params)}/${params.name}`

  // getResourceUrl = (params = {}) =>
  //   `kapis/resources.kubesphere.io/v1alpha3${this.getPath(params)}/${
  //     this.module
  //   }`

  getResourceUrl = () => `sailor/${this.module}`


  getFilterParams = params => {
    const result = { ...params }
    if (result.app) {
      result.labelSelector = result.labelSelector || ''
      result.labelSelector += `app.kubernetes.io/name=${result.app}`
      delete result.app
    }
    return result
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
    filters,
    ...params
    // ...filters
  } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 9
    params.page = params.page || 1

    const result = await request.get(
      this.getResourceUrl(),
      params
    )

    const data = result.items.map(this.mapper)

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
  create(data, params = {}) {
    return this.submitting(request.post(this.getAddUrl(), data))
  }

  @action
  update(params, newObject) {
    return this.submitting(request.put(this.getDetailUrl(params), newObject))
  }

  @action
  patch(params, newObject) {
    return this.submitting(request.patch(this.getDetailUrl(params), newObject))
  }

  @action
  delete(data,params={}) {
    console.log("delete==>",data);
    console.log("params==>",params);
    return this.submitting(request.delete(this.getDeleteUrl(), data))
  }  

  reject = res => {
    this.isSubmitting = false
    window.onunhandledrejection(res)
  }
}