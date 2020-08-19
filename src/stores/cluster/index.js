
import { get, cloneDeep } from 'lodash'
import { action, observable } from 'mobx'

import { LIST_DEFAULT_ORDER, DEFAULT_CLUSTER } from 'utils/constants'

import Base from 'stores/base'
import List from 'stores/base.list'

export default class ClusterStore extends Base {
  @observable
  initializing = true

  @observable
  isAgentLoading = true

  @observable
  clusterCondition = new List()

  @observable
  agent = ''

  @observable
  isValidating = false

  @observable
  version = ''

  module = 'clusters'

  @observable
  project = ''

  projects = new List()


  @action
  async fetchList({ cluster, workspace, namespace, more, ...params } = {}) {
    this.list.isLoading = true
    console.log("start=>list", );
    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get('sailor/getClusterList', params)
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
  async fetchDetail(params) {
    this.isLoading = true
    let detail
    const result = await request.get(
      'sailor/getClusterDetail', 
      params,
      (_, err ) => {
        if (err.reason === 'Not Found') {
          global.navigateTo('/404')
        }
      }
    )
    detail = { ...params, ...this.mapper(result.items) }

    this.detail = detail
    this.isLoading = false
    return detail
  }


  @action
  async fetchAgent(params) {
    this.isAgentLoading = true
    const result = await request.get(this.getAgentUrl(params))

    this.agent = result
    this.isAgentLoading = false
  }

  @action
  async validate(data) {
    this.isValidating = true
    await request.post(
      'kapis/cluster.kubesphere.io/v1alpha1/clusters/validation',
      data,
      {},
      (res, err) => {
        this.isValidating = false
        window.onunhandledrejection({
          status: 400,
          reason: t('Validation failed'),
          message: err.message,
        })
        return Promise.reject()
      }
    )
    this.isValidating = false
  }

  @action
  setProject(project) {
    this.project = project
  }

  @action
  async fetchProjects({ cluster, namespace, more, ...params } = {}) {
    this.projects.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10
    const result = await request.get(`sailor/getMemberMeta`, {'clusterName': cluster})

    const data = get(result, 'items', []).map(item => ({
      cluster,
      ...this.mapper(item),
    }))

    this.projects.update({
      data: more ? [...this.projects.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.projects.silent ? {} : { selectedRowKeys: [] }),
    })
  }

  @action
  async fetchVersion({ cluster }) {
    const result = await request.get(
      `kapis/clusters/${cluster}/version`.replace('/clusters/default', '')
    )
    this.version = get(result, 'kubernetes.gitVersion')
  }

  @action
  create(data, params = {}) {
    return this.submitting(request.post('sailor/addCluster', data))
  }

  @action
  async fetchCondition(params,more)  {

    const result = await request.get('sailor/getCondition', params)
    const data = result.items.length >0 ? result.items :  []
  
    this.clusterCondition.update({
      data: more ? [...this.clusterCondition.data, ...data] : data,
      total: result.total_count,
      limit: 10,
      page: 1,
      isLoading: false,
    })
    return data
  }
}
