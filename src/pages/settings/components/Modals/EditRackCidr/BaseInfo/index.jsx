
import React from 'react'
import { observer } from 'mobx-react'
import { Input, Select } from '@pitrix/lego-ui'
import { Form, TextArea } from 'components/Base'
import { Modal, Button } from 'components/Base'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
    }
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
    }]
    return state
  }

  renderFooter() {
    const { onCancel, isSubmitting } = this.props
    const { currentStep } = this.state

    const total = 1
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <div className="text-right">
            <Button onClick={onCancel}>{t('Cancel')}</Button>
            {currentStep > 0 && (
              <Button type="control" onClick={this.handlePrev}>
                {t('Previous')}
              </Button>
            )}
            {currentStep < total ? (
              <Button type="control" onClick={this.handleNext}>
                {t('Next')}
              </Button>
            ) : (
              <Button
                type="control"
                onClick={this.handleOk}
                loading={isSubmitting}
              >
                {t('Create')}
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }  

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{t('Basic Info')}</div>
          <p>{"修改机柜网段,修改网络之后会重新计算出该机柜的POD网段."}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            controlClassName={styles.nameWrapper}
            label={"CIDR地址"}
            rules={[
              {
                required: true,
                message: "请输入IP地址和子网掩码.",
              },
            ]}
          >
            <Input name="rackCidr" autoFocus={true} disabled placeholder="请输入IP地址和子网掩码." />
          </Form.Item>
          <Form.Item 
            label={"网关地址"}
            rules={[
              {
                required: true,
                message: "请输入网关地址.",
              }]}
          >
            <Input name="rackCidrGw" disabled placeholder="请输入网关地址." />
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
            <Input name="rackTag" placeholder="请输入机柜号" />
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
              disabled
              options={this.getPodNum()}
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
