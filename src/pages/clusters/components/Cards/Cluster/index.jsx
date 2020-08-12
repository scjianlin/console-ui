

import React from 'react'
import { Columns, Column } from '@pitrix/lego-ui'
import { Text, TextCustom } from 'components/Base'
import { getLocalTime } from 'utils'
import ClusterTitle from 'components/Clusters/ClusterTitle'
import styles from './index.scss'

//  import antd
import { Modal, Spin ,Steps} from 'antd'
import { LoadingOutlined } from '@ant-design/icons';
import 'antd/lib/modal/style/index.css'
import 'antd/lib/button/style/index.css'
import 'antd/lib/spin/style/index.css'
import 'antd/lib/steps/style/index.css'

export default  class ClusterCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
    }
  }
  handleCreate = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  handleClick = () => {
    const { data, onEnter } = this.props
    onEnter && onEnter(data.name)
  }

  render() {
    const { data } = this.props
    console.log("data=card=>",data);
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
            { data.isReady===true && (
              <TextCustom
                title={"健康"}
                description={"集群状态"}
                status="success"
              >
              </TextCustom>
            )} 
            { data.isReady === 'init' && (
              <TextCustom
              title={"未就绪"}
              description={"集群状态"}
              status="init"
              onClick={this.handleCreate}
            >
            </TextCustom>
            )}
            { data.isReady === 'failed' && (
            <TextCustom
              title={"异常"}
              description={"集群状态"}
              status="failed"
              onClick={this.handleCreate}
            >
            </TextCustom>
            )}
          </Column>
          <Column>
            <div> 
              <Modal
                visible={this.state.visible}
                title="初始化进度"
                onOk={this.handleOk}
                onCancel={this.handleCancel}                
                footer={null}
                destroyOnClose
              >
                <Steps direction="vertical" size="small" current={1} >
                  <Steps.Step title="1.拷贝文件" status="finish" />
                  <Steps.Step icon={antIcon} title="2.初始化系统" />
                  <Steps.Step title="升级内核" status="wait" />
                  <Steps.Step title="升级内核" status="wait" />
                  <Steps.Step title="升级内核" status="wait" />
                  <Steps.Step title="升级内核" status="wait" />
                </Steps>
              </Modal>
            </div>
          </Column>
        </Columns>
      </li>    
    )
  }
}
