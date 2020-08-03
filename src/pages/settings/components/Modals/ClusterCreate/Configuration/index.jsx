
import React from 'react'
import { observer } from 'mobx-react'
import { Select,TextArea } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import { Button } from 'components/Base'
import RackStore from 'stores/rackcidr'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.rackStore = new RackStore()
    this.rackStore.fetchList()
  }

  getType() {
    const cluserType = [{
      label: "裸金属集群",
      value: "Baremetal",
    },{
      label: "全托管集群",
      value: "Hosted",
    }]
    return cluserType
  }

  clusterIP = [{
    label: "192.168.56.241",
    value: "192.168.56.241",
  },{
    label: "192.168.57.241",
    value: "192.168.57.241",
  },{
    label: "192.168.58.241",
    value: "192.168.58.241",    
  }]  

  // nameValidator = (rule, value, callback) => {
  //   if (!value) {
  //     return callback()
  //   }

  //   if (value === 'workspaces') {
  //     return callback({
  //       message: t('current name is not available'),
  //       field: rule.field,
  //     })
  //   }

  //   this.props.store.checkName({ name: value }).then(resp => {
  //     if (resp.exist) {
  //       return callback({
  //         message: t('Workspace name exists'),
  //         field: rule.field,
  //       })
  //     }
  //     callback()
  //   })
  // }

  handleOk = () => {
    this.props.onOk(this.state.formTemplate)
  }  

  renderFooter() {
    const { onCancel, isSubmitting } = this.props

    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <div className="text-right">
            <Button onClick={onCancel}>{t('Cancel')}</Button>
              <Button
                type="control"
                onClick={this.handleOk}
                loading={isSubmitting}
              >
                {t('Create')}
              </Button>
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
          <div>{"集群配置"}</div>
          <p>{"集群配置"}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
        <Form.Item 
            label={"请选择集群版本"}
            rules={[{
                required: true,
                message: "请选择集群版本!",
              }]}
          >
           <Select
              name="ClusterVersion"
              searchable
              multi
              options={this.clusterIP}
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
                message: "请选择容器版本!",
              }]}
          >
           <Select
              name="DockerVersion"
              searchable
              multi
              options={this.clusterIP}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
            />
          </Form.Item>
          <Form.Item 
            label={"请选择集群初始化模板"}
            rules={[
              {
                required: true,
                message: "请选择集群初始化模板!",
              }]}
          >
           <Select
              name="InitTemplate"
              searchable
              multi
              options={this.clusterIP}
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
              name="CustomScript"
              placeholder="自定义脚本"
              rows="10"
            />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
