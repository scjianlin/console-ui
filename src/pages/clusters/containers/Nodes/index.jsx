import React from 'react'
import { isEmpty, get } from 'lodash'
import { Tooltip, Icon } from '@pitrix/lego-ui'

import { cpuFormat } from 'utils'
import { ICON_TYPES, NODE_STATUS } from 'utils/constants'
import { getNodeStatus } from 'utils/node'
import { getValueByUnit } from 'utils/monitoring'
import NodeStore from 'stores/node'
import NodeMonitoringStore from 'stores/monitoring/node'

import withList, { ListPage } from 'components/HOCs/withList'

import { Avatar, Status, Panel, Text } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'

//  import antd
import { Modal, Steps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'
import styles from './index.scss'
// import 'antd/lib/button/style/index.css'
// import 'antd/lib/spin/style/index.css'
// import 'antd/lib/steps/style/index.css'
// import 'antd/lib/modal/style/index.css'

require('!style-loader!css-loader!antd/lib/modal/style/index.css')
require('!style-loader!css-loader!antd/lib/button/style/index.css')
require('!style-loader!css-loader!antd/lib/spin/style/index.css')
require('!style-loader!css-loader!antd/lib/steps/style/index.css')

const MetricTypes = {
  cpu_used: 'node_cpu_usage',
  cpu_total: 'node_cpu_total',
  cpu_utilisation: 'node_cpu_utilisation',
  memory_used: 'node_memory_usage_wo_cache',
  memory_total: 'node_memory_total',
  memory_utilisation: 'node_memory_utilisation',
  pod_used: 'node_pod_running_count',
  pod_total: 'node_pod_quota',
}

//  def time
let ConditionTime

@withList({
  store: new NodeStore(),
  name: 'Cluster Node',
  module: 'nodes',
})
export default class Nodes extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      conditions: [],
    }
  }

  store = this.props.store

  monitoringStore = new NodeMonitoringStore({ cluster: this.cluster })

  componentDidMount() {
    this.store.fetchCount(this.props.match.params)
  }

  get cluster() {
    return this.props.match.params.cluster
  }

  get tips() {
    return [
      {
        title: t('NODE_TYPES_Q'),
        description: t('NODE_TYPES_A'),
      },
      {
        title: t('WHAT_IS_NODE_TAINTS_Q'),
        description: t('WHAT_IS_NODE_TAINTS_A'),
      },
    ]
  }

  get itemActions() {
    const { store, routing } = this.props
    return [
      {
        key: 'uncordon',
        icon: 'start',
        text: t('Uncordon'),
        action: 'edit',
        show: item => this.getUnschedulable(item),
        onClick: item => store.uncordon(item).then(routing.query),
      },
      {
        key: 'cordon',
        icon: 'stop',
        text: t('Cordon'),
        action: 'edit',
        show: item => !this.getUnschedulable(item),
        onClick: item => store.cordon(item).then(routing.query),
      },
    ]
  }

  get tableActions() {
    const { trigger, routing, tableProps, store } = this.props
    return {
      ...tableProps.tableActions,
      actions: store.nodeRole == 'host' ? [] : null, // 屏蔽master集群添加节点
      selectActions: [
        {
          key: 'taint',
          type: 'default',
          text: t('Taint Management'),
          action: 'edit',
          onClick: () =>
            trigger('node.taint.batch', {
              success: routing.query,
            }),
        },
      ],
    }
  }

  getData = async params => {
    await this.store.fetchList({ ...params, ...this.props.match.params })
    await this.monitoringStore.fetchMetrics({
      ...this.props.match.params,
      resources: this.store.list.data.map(node => node.name),
      metrics: Object.values(MetricTypes),
      last: true,
    })
  }

  getUnschedulable = record => {
    const taints = record.taints

    return taints.some(
      taint => taint.key === 'node.kubernetes.io/unschedulable'
    )
  }

  getLastValue = (node, type, unit) => {
    const metricsData = this.monitoringStore.data
    const result = get(metricsData[type], 'data.result') || []
    const metrics = result.find(item => get(item, 'metric.node') === node.name)
    return getValueByUnit(get(metrics, 'value[1]', 0), unit)
  }

  getRecordMetrics = (record, configs) => {
    const metrics = {}

    configs.forEach(cfg => {
      metrics[cfg.type] = parseFloat(
        this.getLastValue(record, MetricTypes[cfg.type], cfg.unit)
      )
    })
    return metrics
  }

  renderTaintsTip = data => (
    <div>
      <div>{t('Taints')}:</div>
      <div>
        {data.map(item => {
          const text = `${item.key}=${item.value || ''}:${item.effect}`
          return <div key={text}>{text}</div>
        })}
      </div>
    </div>
  )

  getStatus() {
    return NODE_STATUS.map(status => ({
      text: t(status.text),
      value: status.value,
    }))
  }

  handleCreate = (ip, clusterName) => () => {
    this.setState({
      visible: true,
    })
    this.getCondition(ip, clusterName)
  }

  // timer start
  getCondition = (ip, clusterName) => {
    ConditionTime = setInterval(
      () =>
        this.store.fetchCondition({ ipAddr: ip, clusterName }).then(resp => {
          this.setState({
            conditions: resp,
          })
        }),
      10000
    )
  }

  handleOk = e => {
    this.setState({
      visible: false,
    })
  }

  handleCancel = e => {
    this.setState({
      visible: false,
    })
    clearInterval(ConditionTime)
  }

  showConditions() {
    if (this.state.conditions.length > 0) return this.state.conditions

    return [
      {
        type: 'EnsureSystem',
        name: '准备中...',
        status: 'False',
      },
    ]
  }

  getColumns = () => {
    const { module, prefix, getSortOrder, getFilteredValue } = this.props
    return [
      {
        title: t('Name'),
        dataIndex: 'name',
        sorter: true,
        sortOrder: getSortOrder('name'),
        search: true,
        render: (name, record) => (
          <Avatar
            icon={ICON_TYPES[module]}
            iconSize={40}
            to={`${prefix}/${name}`}
            title={name}
            desc={record.ip}
          />
        ),
      },
      {
        title: t('Status'),
        dataIndex: 'status',
        filters: this.getStatus(),
        filteredValue: getFilteredValue('status'),
        isHideable: true,
        search: true,
        render: (_, record) => {
          const status = getNodeStatus(record)
          const ipaddr = record.name
          const clusterName = record.labels.clusterName
          const taints = record.taints
          const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

          return (
            <div className={styles.status}>
              {status !== 'Running' ? (
                <div onClick={this.handleCreate(ipaddr, clusterName)}>
                  <Status
                    type={status}
                    name={t(`NODE_STATUS_${status.toUpperCase()}`)}
                  />
                </div>
              ) : (
                <Status
                  type={status}
                  name={t(`NODE_STATUS_${status.toUpperCase()}`)}
                />
              )}
              {!isEmpty(taints) && (
                <Tooltip content={this.renderTaintsTip(taints)}>
                  <span className={styles.taints}>{taints.length}</span>
                </Tooltip>
              )}
              <div>
                <Modal
                  visible={this.state.visible}
                  title="集群节点进度"
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                  footer={null}
                  destroyOnClose
                >
                  <Steps direction="vertical" size="small">
                    {this.showConditions().map((cond, index) =>
                      cond.status === 'True' ? (
                        <Steps.Step
                          key={index}
                          title={cond.name}
                          status="finish"
                          description={`完成时间: ${cond.time}`}
                        />
                      ) : (
                        <Steps.Step
                          key={index}
                          icon={antIcon}
                          title={cond.name}
                          status="wait"
                        />
                      )
                    )}
                  </Steps>
                </Modal>
              </div>
            </div>
          )
        },
      },
      {
        title: t('Role'),
        dataIndex: 'role',
        isHideable: true,
        search: true,
        render: roles => roles.join(','),
      },
      {
        title: t('CPU'),
        key: 'cpu',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'cpu_used',
              unit: 'Core',
            },
            {
              type: 'cpu_total',
              unit: 'Core',
            },
            {
              type: 'cpu_utilisation',
            },
          ])

          return (
            <Text
              title={
                <Tooltip
                  content={this.renderCPUTooltip(record)}
                  placement="right"
                >
                  <div className={styles.resource}>
                    <span>{`${Math.round(
                      metrics.cpu_utilisation * 100
                    )}%`}</span>
                    {metrics.cpu_utilisation >= 0.9 && (
                      <Icon name="exclamation" />
                    )}
                  </div>
                </Tooltip>
              }
              description={`${metrics.cpu_used}/${metrics.cpu_total} Core`}
            />
          )
        },
      },
      {
        title: t('Memory'),
        key: 'memory',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'memory_used',
              unit: 'Gi',
            },
            {
              type: 'memory_total',
              unit: 'Gi',
            },
            {
              type: 'memory_utilisation',
            },
          ])

          return (
            <Text
              title={
                <Tooltip
                  content={this.renderMemoryTooltip(record)}
                  placement="right"
                >
                  <div className={styles.resource}>
                    <span>{`${Math.round(
                      metrics.memory_utilisation * 100
                    )}%`}</span>
                    {metrics.memory_utilisation >= 0.9 && (
                      <Icon name="exclamation" />
                    )}
                  </div>
                </Tooltip>
              }
              description={`${metrics.memory_used}/${metrics.memory_total} Gi`}
            />
          )
        },
      },
      {
        title: t('Pods'),
        key: 'pods',
        isHideable: true,
        render: record => {
          const metrics = this.getRecordMetrics(record, [
            {
              type: 'pod_used',
            },
            {
              type: 'pod_total',
            },
          ])
          const uitilisation = metrics.pod_total
            ? parseFloat(metrics.pod_used / metrics.pod_total)
            : 0

          return (
            <Text
              title={`${Math.round(uitilisation * 100)}%`}
              description={`${metrics.pod_used}/${metrics.pod_total}`}
            />
          )
        },
      },
    ]
  }

  renderCPUTooltip(record) {
    return (
      <div>
        <div className="tooltip-title">{t('Resource Usage')}</div>
        <p>
          {t('CPU Requests')}:{' '}
          {cpuFormat(
            get(record, 'annotations["node.kubesphere.io/cpu-requests"]')
          )}{' '}
          Core (
          {get(
            record,
            'annotations["node.kubesphere.io/cpu-requests-fraction"]'
          )}
          )
        </p>
        <p>
          {t('CPU Limits')}:{' '}
          {cpuFormat(
            get(record, 'annotations["node.kubesphere.io/cpu-limits"]')
          )}{' '}
          Core (
          {get(record, 'annotations["node.kubesphere.io/cpu-limits-fraction"]')}
          )
        </p>
      </div>
    )
  }

  renderMemoryTooltip(record) {
    return (
      <div>
        <div className="tooltip-title">{t('Resource Usage')}</div>
        <p>
          {t('Memory Requests')}:{' '}
          {getValueByUnit(
            get(record, 'annotations["node.kubesphere.io/memory-requests"]'),
            'Gi'
          )}{' '}
          Gi (
          {get(
            record,
            'annotations["node.kubesphere.io/memory-requests-fraction"]'
          )}
          )
        </p>
        <p>
          {t('Memory Limits')}:{' '}
          {getValueByUnit(
            get(record, 'annotations["node.kubesphere.io/memory-limits"]'),
            'Gi'
          )}{' '}
          Gi (
          {get(
            record,
            'annotations["node.kubesphere.io/memory-limits-fraction"]'
          )}
          )
        </p>
      </div>
    )
  }

  showCreate = () => {
    const { getData } = this.props
    console.log('getData==>', this.props)
    return this.props.trigger('cluster.create', {
      success: getData,
    })
  }

  renderOverview() {
    const { masterCount, masterWorkerCount, list } = this.store
    const totalCount = list.total
    // const workerCount = Math.max(
    //   Number(totalCount) - Number(masterCount) + Number(masterWorkerCount),
    //   0
    // )

    return (
      <Panel className="margin-b12">
        <div className={styles.overview}>
          <Text icon="nodes" title={totalCount} description={t('Node Count')} />
          <Text title={masterCount} description={t('Master Node')} />
          <Text title={masterWorkerCount} description={t('Worker Node')} />
        </div>
      </Panel>
    )
  }

  render() {
    const { bannerProps, tableProps, store } = this.props
    const isLoadingMonitor = this.monitoringStore.isLoading

    return (
      <ListPage {...this.props} getData={this.getData} noWatch>
        <Banner {...bannerProps} tips={this.tips} />
        {this.renderOverview()}
        <Table
          {...tableProps}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          columns={this.getColumns()}
          monitorLoading={isLoadingMonitor}
          onCreate={this.showCreate}
          store={store}
          alwaysUpdate
        />
      </ListPage>
    )
  }
}
