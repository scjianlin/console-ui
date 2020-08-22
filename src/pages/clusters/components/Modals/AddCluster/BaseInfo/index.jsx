
import React from 'react'
import { observer } from 'mobx-react'
import { Input,Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import RackStore from 'stores/rackcidr'
import ClusterVersion from 'stores/clusterVersion'
import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.rackStore = new RackStore()
    this.rackStore.fetchList(),
    this.clusterVersion = new ClusterVersion()
    this.clusterVersion.fetchList()
    this.state = {
      currentStep: 0,
    }
  }
  // 存放节点列表
  nodeList = []
  podPool = []

  //  获取机柜信息
  getRack() {
    let res = []
    this.rackStore.list.data.filter(function(item) {
      if (item.isMaster==0) { //获取节点机柜
        res.push({label:item.rackTag,value:item.rackTag})
      }
    })
    return res
  }

  changeNode =(nodeRack) => {
    let list = this.rackStore.addrList;
    for (let i=0;i<list.length;i++) {
      if (nodeRack.indexOf(list[i].rackTag) > -1) { //获取已经选择的master机柜
        this.nodeList.push(list[i])
      }
    }
    let node = this.rackStore.list.data;
    for (let i=0;i<node.length;i++) {
      if (nodeRack.indexOf(node[i].rackTag) > -1) { 
        for (let j=0;j<node[i].podCidr.length;j++) {
          if (node[i].podCidr[j].useState == 0) {
            this.podPool.push({
              label: node[i].rackTag +": " + node[i].podCidr[j].rangeStart +"-" + node[i].podCidr[j].rangeEnd,
              value: node[i].podCidr[j].id
            })
          }
        }
      }
    }
  }

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Basic Info')}</div>
          <p>{"增加集群基本信息"}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            controlClassName={styles.nameWrapper}
            label={"集群名称"}
            rules={[
              {
                required: true,
                message: "请输入集群名称",
              },
            ]}
          >
            <Input name="clusterName" autoFocus={true} disabled placeholder="请输入集群名称" />
          </Form.Item>
          <Form.Item 
            label={"选择机柜"}
            rules={[
              {
                required: true,
                message: "请选择选择机柜",
              }]}
          >
            <Select
              name="nodeRack"
              searchable
              multi
              options={this.getRack()}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              onChange={this.changeNode}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item 
            label={"选择IP地址"}
            rules={[
              {
                required: true,
                message: "请选择选择IP地址",
              }]}
          >
            <Select
              name="addressList"
              searchable
              multi
              options={this.nodeList}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item 
            label={"选择Pod地址池"}
            rules={[
              {
                required: true,
                message: "请选择Pod地址池",
              }]}
          >
            <Select
              name="podPool"
              searchable
              multi
              options={this.podPool}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>               
          <Form.Item 
            label={"输入服务器用户"}
            rules={[{
                required: true,
                message: "输入服务器用户",
              }]}
          >
            <Input name="userName" placeholder="输入服务器用户" />
          </Form.Item>
          <Form.Item 
            label={"输入服务器密码"}
            rules={[{
                required: true,
                message: "输入服务器密码",
              }]}
          >
            <Input name="passWord" placeholder="输入服务器密码" type="password" />
          </Form.Item>          
        </Form>
      </div>
    )
  }
}
