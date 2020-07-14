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

import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import classnames from 'classnames'
import { isEmpty, get } from 'lodash'

import { cacheFunc } from 'utils'
import { getAreaChartOps } from 'utils/monitoring'
import PodMonitorStore from 'stores/monitoring/pod'

import { Alert } from '@pitrix/lego-ui'
import { MultiArea } from 'components/Charts'
import { Controller as MonitoringController } from 'components/Cards/Monitoring'
import { PodsMonitoring } from 'components/Modals/Monitoring/Multiple'

import styles from './index.scss'

const MetricTypes = {
  cpu_usage: 'pod_cpu_usage',
  memory_usage: 'pod_memory_usage_wo_cache',
  net_transmitted: 'pod_net_bytes_transmitted',
  net_received: 'pod_net_bytes_received',
}

class Monitorings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showMultipleModal: false,
      selectItem: {},
      pods: [],
    }

    this.monitorStore = new PodMonitorStore()
    this.resourceStore = new PodMonitorStore()
  }

  get store() {
    return this.props.detailStore
  }

  get monitoringModule() {
    return 'deployment'
  }

  get metrics() {
    return this.monitorStore.data
  }

  get resourceParams() {
    const { namespace, name } = this.store.detail

    return {
      namespace,
      workloadKind: this.monitoringModule,
      workloadName: name,
    }
  }

  get isMore() {
    const data =
      get(
        toJS(this.resourceStore.sort),
        `data[${MetricTypes.cpu_usage}].data.result`
      ) || []
    return data.length > 5
  }

  fetchData = (params = {}) => {
    const { pods } = this.state

    if (isEmpty(pods)) {
      this.resourceStore
        .fetchSortedMetrics({
          ...this.resourceParams,
          metrics: [MetricTypes.cpu_usage],
          limit: 6,
        })
        .then(data => {
          const result = get(data[MetricTypes.cpu_usage], 'data.result') || []
          const _pods = result.map(item => get(item, 'metric.resource_name'))

          this.setState({ pods: _pods }, () => {
            this.fetchMetrics({ resources: _pods, ...params })
          })
        })
    } else {
      this.fetchMetrics({ resources: pods, ...params })
    }
  }

  fetchMetrics = params => {
    this.monitorStore.fetchMetrics({
      resources: [],
      metrics: Object.values(MetricTypes),
      ...this.resourceParams,
      ...params,
    })
  }

  getMonitoringCfgs = () => [
    {
      type: 'cpu',
      title: 'CPU Usage',
      unitType: 'cpu',
      metricType: MetricTypes.cpu_usage,
    },
    {
      type: 'memory',
      title: 'Memory Usage',
      unitType: 'memory',
      metricType: MetricTypes.memory_usage,
    },
    {
      type: 'bandwidth',
      title: 'Network Outbound',
      unitType: 'bandwidth',
      metricType: MetricTypes.net_transmitted,
    },
    {
      type: 'bandwidth',
      title: 'Network Inbound',
      unitType: 'bandwidth',
      metricType: MetricTypes.net_received,
    },
  ]

  showMultipleModal = config =>
    cacheFunc(
      `_showMultipleModal_${config.title}`,
      () => {
        this.setState({
          showMultipleModal: true,
          selectItem: {
            ...config,
            legend: ['Usage'],
          },
        })
      },
      this
    )

  hideMultipleModal = () => {
    this.setState({
      showMultipleModal: false,
      selectItem: {},
    })
  }

  renderCard() {
    const { createTime } = this.store.detail
    const { isLoading, isRefreshing } = this.monitorStore
    const configs = this.getMonitoringCfgs()
    const isMore = this.isMore

    return (
      <MonitoringController
        createTime={createTime}
        onFetch={this.fetchData}
        loading={isLoading}
        refreshing={isRefreshing}
        isEmpty={isEmpty(this.metrics)}
      >
        {isMore && (
          <Alert description={t('MONITORING_ALERT_DESC')} type="info" />
        )}
        {configs.map(item => {
          item.data = get(this.metrics, `${item.metricType}.data.result`) || []
          item.legend = item.data.map((record, index) =>
            get(record, 'metric.resource_name', `pod${index}`)
          )

          const config = getAreaChartOps(item)

          if (isEmpty(config.data)) return null

          return (
            <div key={item.title} className={classnames(styles.item)}>
              {isMore && (
                <div
                  className={styles.more}
                  onClick={this.showMultipleModal(item)}
                >
                  {t('View all replicas')}
                </div>
              )}
              <MultiArea width="100%" {...config} />
            </div>
          )
        })}
      </MonitoringController>
    )
  }

  renderModal() {
    const { showMultipleModal, selectItem } = this.state
    const { name, namespace } = this.store.detail

    return (
      <div>
        <PodsMonitoring
          visible={showMultipleModal}
          module={this.monitoringModule}
          name={name}
          namespace={namespace}
          config={selectItem}
          onCancel={this.hideMultipleModal}
        />
      </div>
    )
  }

  render() {
    return (
      <div>
        {this.renderCard()}
        {this.renderModal()}
      </div>
    )
  }
}

export default inject('rootStore')(observer(Monitorings))
export const Component = Monitorings
