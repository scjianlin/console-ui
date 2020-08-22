import React from 'react'
import { Select, Input } from '@pitrix/lego-ui'
import { Form,  CodeEditor } from 'components/Base'

import SubTitle from '../SubTitle'
import styles from './index.scss'
import RackStore from 'stores/rackcidr'
import ClusterVersion from 'stores/clusterVersion'
import { observer } from 'mobx-react'

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

  // pod 地址池
  podPool = []

  get editOptions() {
    return {
      width: '74%',
    }
  }

  getClusterIp =() => {
    const { formTemplate } = this.props
    let node = []
    let pod = []
    this.rackStore.list.data.filter(function(item) {
      if (formTemplate.clusterRack.indexOf(item.rackTag) > -1) { //获取已经选择的master机柜
        for (let i=0;i<item.hostAddr.length;i++) {
          node.push({
            label: item.hostAddr[i].ipAddr + "-" + item.rackTag,
            value: item.hostAddr[i].ipAddr
          })
        }
        for (let j =0;j<item.podCidr.length;j++) {
          pod.push({
            label: item.rackTag +": " + item.podCidr[j].rangeStart +"-" + item.podCidr[j].rangeEnd,
            value: item.podCidr[j].id
          })
        }
      }
    })
    this.podPool = pod;
    return node
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

  render() {
    const { formTemplate } = this.props
    return (
      <div>
        <SubTitle
          title={"集群设置"}
          description={"设置集群的网络，集群版本等等"}
        />
         { formTemplate.clusterType=="Baremetal" && (
          <Form.Item 
            label={"选择IP地址"}
            rules={[{
                required: true,
                message: "请选择IP地址",
              }]}
          >
            <Select
              name="clusterIp"
              searchable
              multi
              options={this.getClusterIp()}
            />
          </Form.Item>)}
          { formTemplate.clusterType=="Baremetal" && (
          <Form.Item 
            label={"请选择Pod地址段"}
            rules={[{
                required: true,
                message: "请选择Pod地址段",
            }]}
          >
            <Select
              name="podPool"
              searchable
              multi
              options={this.podPool}
            />
          </Form.Item>
          )}          
          { formTemplate.clusterType=="Baremetal" && (
          <Form.Item 
            label={"输入服务器用户"}
            rules={[{
                required: true,
                message: "输入服务器用户",
            }]}
          >
            <Input name="userName" placeholder="输入服务器用户" />
          </Form.Item>
          )}
          { formTemplate.clusterType=="Baremetal" && (
          <Form.Item 
            label={"输入服务器密码"}
            rules={[{
                required: true,
                message: "输入服务器密码",
            }]}
          >
            <Input name="passWord" placeholder="输入服务器密码" type="password" />
          </Form.Item>  
          )}
          <Form.Item 
            label={"请选择集群版本"}
            rules={[{
                required: true,
                message: "请选择集群版本!",
              }]}
            >
            <Select
              name="clusterVersion"
              searchable
              options={this.getClusterVersion()}
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
              />
          </Form.Item>
          { formTemplate.clusterType=="Baremetal" && (
          <Form.Item label={"请输入自定义脚本"}>
            <CodeEditor
              mode="yaml"
              name="customScript"
              className={styles.editor}
              options={this.editOptions}
            />
          </Form.Item>
          )}
      </div>
    )
  }
}
