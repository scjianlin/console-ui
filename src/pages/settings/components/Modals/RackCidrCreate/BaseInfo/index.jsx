
import React from 'react'
import { observer } from 'mobx-react'
import { Input, Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import {  Button } from 'components/Base'
import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

  }

  getRackState() {
    const state = [{
      label: "是",
      value: 1,
    },{
      label: "否",
      value: 0,
    }]
    return state
  }

  getPodNum() {
   const state = [{
      label: "32",
      value: 32,
    },{
      label: "64",
      value: 64,
    },{
      label: "100",
      value: 100,      
    },{
      label: "120",
      value: 120,
    },{
      label: "240",
      value: 240,      
    }]
    return state
  }

  KeyDown = e => {
    if(e.keyCode === 32 || e.keyCode === 13) {
      return false
    }
  }

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Basic Info')}</div>
          <p>{"增加机柜网段,增加网络之后会计算出该机柜的POD网段"}</p>
        </div>
        <Form data={formTemplate} ref={formRef}  >
          <Form.Item
            label={"CIDR地址"}
            rules={[
              {
                required: true,
                message: "请输入IP地址和子网掩码.",
              },
            ]}
          >
            <Input 
              name="rackCidr"
              autoFocus={true}
              onKeyDown={this.KeyDown}
              placeholder="请输入IP地址和子网掩码."
            />
          </Form.Item>
          <Form.Item 
            label={"网关地址"}
            rules={[
              {
                required: true,
                message: "请输入网关地址.",
              }]}
          >
            <Input name="rackCidrGw" placeholder="请输入网关地址." />
          </Form.Item>
          <Form.Item 
            label={"Service路由"}
            rules={[
              {
                required: true,
                message: "请输入Service路由.",
              }]}
          >
            <Input name="serviceRoute" placeholder="请输入Service路由." />
          </Form.Item>          
          <Form.Item label={"所属网络"}>
            <Input name="providerCidr" placeholder="请输入所属网络地址." />
          </Form.Item>
          <Form.Item 
            label={"机柜号"}
            rules={[
              {
                required: true,
                message: "请输入机柜号.",
              }]}
          >
            <Input name="rackTag" placeholder="请输入机柜号." />
          </Form.Item>
          <Form.Item
            label={"请选择POD数量"}
            rules = {[
              {
                required: true,
                message: "请选择POD数量.",                
              }
            ]}
          >
            <Select
              name="podNum"
              searchable
              options={this.getPodNum()}
              defaultValue={32}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item
            label={"是否为Master机柜"}
            rules = {[
              {
                required: true,
                message: "请选择是是否为Master机柜.",                
              }
            ]}
          >
            <Select
              name="isMaster"
              searchable
              defaultValue={0}
              options={this.getRackState()}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>          
        </Form>
      </div>
    )
  }
}
