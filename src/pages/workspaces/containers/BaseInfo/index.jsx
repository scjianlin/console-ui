import React from 'react'
import { get, isEmpty } from 'lodash'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Checkbox } from '@pitrix/lego-ui'
import { Text, Panel, Alert, Button, Switch } from 'components/Base'
import Banner from 'components/Cards/Banner'
import EditBasicInfoModal from 'workspaces/components/Modals/EditBasicInfo'
import ClusterTitle from 'components/Clusters/ClusterTitle'

import { getLocalTime } from 'utils'
import { trigger } from 'utils/action'

import WorkspaceMonitorStore from 'stores/monitoring/workspace'

import styles from './index.scss'

@inject('rootStore', 'workspaceStore')
@observer
export default class BaseInfo extends React.Component {
  monitorStore = new WorkspaceMonitorStore()

  state = {
    confirm: false,
  }

  componentDidMount() {
    this.fetchMetrics()
  }

  get store() {
    return this.props.workspaceStore
  }

  get module() {
    return 'BaseInfo'
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get workspace() {
    return this.props.match.params.workspace
  }

  get isMultiCluster() {
    return !isEmpty(this.store.detail.clusters)
  }

  get tips() {
    return [
      {
        title: t('WORKSPACE_BASE_INFO_Q1'),
        description: t('WORKSPACE_BASE_INFO_A1'),
      },
    ]
  }

  get enabledActions() {
    return globals.app.getActions({
      module: 'workspace-settings',
      workspace: this.workspace,
    })
  }

  getMetrics = () => {
    const data = toJS(this.monitorStore.statistics.data)
    const metrics = {}

    Object.entries(data).forEach(([key, value]) => {
      metrics[key] = get(value, 'data.result[0].value[1]', 0)
    })

    return metrics
  }

  fetchMetrics = () => {
    this.monitorStore.fetchStatistics(this.workspace)
  }

  fetchDetail = () => {
    this.store.fetchDetail({ workspace: this.workspace })
  }

  showEdit = () => {
    this.trigger('resource.baseinfo.edit', {
      detail: toJS(this.store.detail),
      modal: EditBasicInfoModal,
      success: this.fetchDetail,
    })
  }

  handleNetworkChange = cluster => () => {
    const detail = toJS(this.store.detail)
    const { overrides } = detail
    let override = overrides.find(od => od.clusterName === cluster)
    if (!override) {
      override = {
        clusterName: cluster,
        clusterOverrides: [],
      }
      overrides.push(override)
    }

    let cod = override.clusterOverrides.find(
      item => item.path === '/spec/networkIsolation'
    )
    if (!cod) {
      cod = {
        path: '/spec/networkIsolation',
      }
      override.clusterOverrides.push(cod)
    }

    cod.value = !get(
      detail,
      `clusterTemplates[${cluster}].spec.networkIsolation`
    )

    this.store
      .patch(detail, {
        metadata: { name: detail.name },
        spec: { overrides },
      })
      .then(() => this.fetchDetail())
  }

  handleDeleteCheckboxChange = (e, checked) => {
    this.setState({ confirm: checked })
  }

  handleDelete = () => {
    const { name } = this.store.detail
    this.store
      .delete({ name })
      .then(() => this.props.rootStore.routing.push('/'))
  }

  getResourceOptions = () => {
    const metrics = this.getMetrics()

    return [
      {
        name: 'Projects',
        icon: 'project',
        value: metrics.workspace_namespace_count,
      },
      {
        name: 'DevOps Projects',
        icon: 'strategy-group',
        value: metrics.workspace_devops_project_count,
        hidden: !globals.app.hasKSModule('devops'),
      },
      {
        name: 'Workspace Members',
        icon: 'human',
        value: metrics.workspace_member_count,
      },
    ]
  }

  renderBaseInfo() {
    const { detail } = this.store
    const options = this.getResourceOptions()
    return (
      <Panel title={t('Workspace Info')}>
        <div className={styles.header}>
          <Text
            className={styles.title}
            icon="enterprise"
            title={detail.name}
            description={detail.description || t('Workspace')}
            ellipsis
          />
          <Text title={detail.manager} description={t('Manager')} />
          <Text
            title={getLocalTime(detail.createTime).format(
              'YYYY-MM-DD HH:mm:ss'
            )}
            description={t('Created Time')}
          />
          {this.enabledActions.includes('manage') && (
            <Button className={styles.action} onClick={this.showEdit}>
              {t('Edit Info')}
            </Button>
          )}
        </div>
        <div className={styles.content}>
          {options
            .filter(option => !option.hidden)
            .map(option => (
              <Text
                key={option.name}
                icon={option.icon}
                title={option.value}
                description={t(option.name)}
              />
            ))}
        </div>
      </Panel>
    )
  }

  renderDelete() {
    return (
      <Panel title={t('Delete Workspace')}>
        <Alert
          className={styles.tip}
          type="error"
          title={`${t('Delete Workspace')} ?`}
          message={t('DELETE_WORKSPACE_DESC')}
        />
        <Button
          className={styles.unbind}
          type="danger"
          disabled={!this.state.confirm}
          onClick={this.handleDelete}
        >
          {t('Delete')}
        </Button>
        <Checkbox onChange={this.handleDeleteCheckboxChange}>
          {t('SURE_TO_DELETE_WORKSPACE')}
        </Checkbox>
      </Panel>
    )
  }

  renderNetwork() {
    const workspace = this.store.detail
    if (!globals.app.isMultiCluster) {
      const networkIsolation = workspace.networkIsolation || false
      return (
        <Panel className={styles.network} title={t('Network Policy')}>
          <div className={styles.item}>
            <Text
              icon="firewall"
              title={t(networkIsolation ? 'On' : 'Off')}
              description={t('Workspace Network Isolation')}
            />
            {this.enabledActions.includes('manage') && (
              <Switch
                className={styles.switch}
                text={t(networkIsolation ? 'On' : 'Off')}
                onChange={this.handleNetworkChange(workspace)}
                checked={networkIsolation}
              />
            )}
          </div>
        </Panel>
      )
    }

    const { data, isLoading } = toJS(this.store.clusters)

    return (
      <Panel className={styles.network} title={t('Network Policy')}>
        {isEmpty(data) && !isLoading && (
          <div className={styles.empty}>{t('No Available Cluster')}</div>
        )}
        {data.map(cluster => {
          const clusterTemp =
            get(workspace, `clusterTemplates[${cluster.name}]`) || {}
          const networkIsolation =
            get(clusterTemp, 'spec.networkIsolation') ||
            workspace.networkIsolation ||
            false

          return (
            <div className={styles.item} key={cluster.name}>
              <ClusterTitle cluster={cluster} className={styles.clusterTitle} />
              <Text
                icon="firewall"
                title={t(networkIsolation ? 'On' : 'Off')}
                description={t('Workspace Network Isolation')}
              />
              {this.enabledActions.includes('manage') && cluster.isReady && (
                <Switch
                  className={styles.switch}
                  text={t(networkIsolation ? 'On' : 'Off')}
                  onChange={this.handleNetworkChange(cluster.name)}
                  checked={networkIsolation}
                />
              )}
            </div>
          )
        })}
      </Panel>
    )
  }

  render() {
    return (
      <div>
        <Banner
          title={t('Basic Info')}
          icon="cdn"
          description={t('WORKSPACE_CREATE_DESC')}
          tips={this.tips}
          module={this.module}
        />
        {this.renderBaseInfo()}
        {this.renderNetwork()}
        {this.enabledActions.includes('manage') && this.renderDelete()}
      </div>
    )
  }
}

// export default BaseInfo
