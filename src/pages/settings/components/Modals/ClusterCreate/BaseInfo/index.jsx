
import React from 'react'
import { observer } from 'mobx-react'
import { Input,Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import RackStore from 'stores/rackcidr'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.rackStore = new RackStore()
    this.rackStore.fetchList(),
    this.state = {
      currentStep: 0,
    }
  }

  cluserType = [{
    label: "裸金属集群",
    value: "Baremetal",
  },{
    label: "全托管集群",
    value: "Hosted",
  }]

  getRack() {
    let res = []
    this.rackStore.list.data.filter(function(item) {
      if (item.isMaster==1) {
        res.push({label:item.rackTag,value:item.rackTag})
      }
    })
    return res
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
            <Input name="clusterName" autoFocus={true} placeholder="请输入集群名称" />
          </Form.Item>
          <Form.Item 
            label={"集群类型"}
            rules={[
              {
                required: true,
                message: "请选择集群类型",
              }]}
          >
           <Select
              name="clusterType"
              searchable
              options={this.cluserType}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
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
              name="clusterRack"
              searchable
              multi
              options={this.getRack()}
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
