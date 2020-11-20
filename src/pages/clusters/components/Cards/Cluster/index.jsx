import React from 'react'
import { Columns, Column } from '@pitrix/lego-ui'
import { Text, TextCustom } from 'components/Base'
import { getLocalTime } from 'utils'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import ClusterStore from 'stores/cluster'

//  import antd
import { Modal, Spin, Steps } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { observer } from 'mobx-react'
import styles from './index.scss'
// import 'antd/lib/modal/style/index.css'
// import 'antd/lib/button/style/index.css'
// import 'antd/lib/spin/style/index.css'
// import 'antd/lib/steps/style/index.css'

//  import css
require('!style-loader!css-loader!antd/lib/modal/style/index.css')
require('!style-loader!css-loader!antd/lib/button/style/index.css')
require('!style-loader!css-loader!antd/lib/spin/style/index.css')
require('!style-loader!css-loader!antd/lib/steps/style/index.css')

// def
let ConditionTime

@observer
export default class ClusterCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
    this.Cluster = new ClusterStore()
  }

  handleCreate = () => {
    this.setState({
      visible: true,
    })
    this.getCondition()
  }

  // timer start
  getCondition = () => {
    const { data } = this.props
    ConditionTime = setInterval(
      () =>
        this.Cluster.fetchCondition({
          clusterType: data.clusterType,
          clusterName: data.name,
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
    const clusterCondition = this.Cluster.clusterCondition.data
    if (clusterCondition.length > 0) return clusterCondition

    return [
      {
        type: 'EnsureSystem',
        name: '准备中...',
        status: 'False',
      },
    ]
  }

  handleClick = () => {
    const { data, onEnter } = this.props
    onEnter && onEnter(data.name)
  }

  render() {
    const { data } = this.props
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />

    return (
      <li className={styles.wrapper} data-test="cluster-item">
        <Columns>
          <Column className="is-4">
            <ClusterTitle cluster={data} onClick={this.handleClick} />
          </Column>
          <Column className="is-2">
            <Text title={data.nodeCount} description={t('Node Count')} />
          </Column>
          <Column className="is-2">
            <Text
              title={data.kubernetesVersion}
              description={t('Kubernetes Version')}
            />
          </Column>
          <Column className="is-3">
            <Text
              title={getLocalTime(data.lastProbeTime).format(
                `YYYY-MM-DD HH:mm:ss`
              )}
              description={t('Created Time')}
            />
          </Column>
          <Column className="is-1">
            {data.isReady === 'Running' && (
              <TextCustom
                title={'健康'}
                description={'集群状态'}
                status="success"
              />
            )}
            {data.isReady === 'Initializing' && (
              <TextCustom
                title={'未就绪'}
                description={'集群状态'}
                status="init"
                onClick={this.handleCreate}
              />
            )}
            {data.isReady === 'Failed' && (
              <TextCustom
                title={'异常'}
                description={'集群状态'}
                status="failed"
              />
            )}
            {data.isReady === 'Terminating' && (
              <TextCustom
                title={'销毁中'}
                description={'集群状态'}
                status="failed"
              />
            )}
            {data.isReady === 'NotSupport' && (
              <TextCustom
                title={'版本不支持'}
                description={'集群状态'}
                status="failed"
              />
            )}
          </Column>
          <Column>
            <div>
              <Modal
                visible={this.state.visible}
                title="集群初始化进度"
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
          </Column>
        </Columns>
      </li>
    )
  }
}
