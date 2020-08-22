
import React from 'react'
import { observer } from 'mobx-react'
import { Select,TextArea } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import RackStore from 'stores/rackcidr'
import ClusterVersion from 'stores/clusterVersion'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    //  http request
    this.rackStore = new RackStore()
    this.rackStore.fetchList()
    this.clusterVersion = new ClusterVersion()
    this.clusterVersion.fetchList()
  }

  getClusterVersion() {
    let ves = []
    this.clusterVersion.list.data.filter(function(item) {
      ves.push({
        label: item.masterVersion,
        value: item.masterVersion
      })
    })
    return ves
  }

  getDockerVersion() {
    let ves = []
    this.clusterVersion.list.data.filter(function(item) {
      ves.push({
        label: item.dockerVersion,
        value: item.dockerVersion
      })
    })
    return ves
  }  

  getClusterIp =() => {
    let ips = []
    const { formTemplate } = this.props

    this.rackStore.list.data.filter(function(item) {
      if (formTemplate.clusterRack.indexOf(item.rackTag) > -1) { //获取已经选择的master机柜

        for (let i=0;i<item.hostAddr.length;i++) {
          ips.push({
            label: item.hostAddr[i].ipAddr + "-" + item.rackTag,
            value: item.hostAddr[i].ipAddr
          })
        }
      }
    })
    return ips
  }

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{"集群配置"}</div>
        </div>
        <Form data={formTemplate} ref={formRef}>
        <Form.Item
            label={"请选择Kubelet版本"}
            rules={[{
                required: true,
                message: "请选择集群版本!",
              }]}
          >
           <Select
              name="nodeVersion"
              searchable
              options={this.getClusterVersion()}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item 
            label={"请选择容器版本"}
            rules={[
              {
                required: true,
                message: "请选择容器版本",
              }]}
          >
           <Select
              name="dockerVersion"
              searchable
              options={this.getDockerVersion()}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item
            controlClassName={styles.textarea}
            label={"自定义配置"}
          >
            <TextArea
              name="customScript"
              placeholder="自定义脚本"
              defaultValue=" "
              rows="5"
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
