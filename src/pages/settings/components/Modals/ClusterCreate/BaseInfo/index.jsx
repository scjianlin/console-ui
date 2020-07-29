
import { debounce,cloneDeep, times } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import { Input,Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import FORM_TEMPLATES from 'utils/form.templates'
import { Button } from 'components/Base'
import RackStore from 'stores/rackcidr'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.rackStore = new RackStore()
    this.rackStore.fetchList()
    this.state = {
      currentStep: 0,
      formTemplate: cloneDeep(FORM_TEMPLATES['workspaces']()),
    },
    this.isHosted = false
  }

  cluserType = [{
    label: "裸金属集群",
    value: "Baremetal",
  },{
    label: "全托管集群",
    value: "Hosted",
  }]

  get networkOptions() {
    return [
      { label: t('Off'), value: 'false' },
      { label: t('On'), value: 'true' },
    ]
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value === 'workspaces') {
      return callback({
        message: t('current name is not available'),
        field: rule.field,
      })
    }

    this.props.store.checkName({ name: value }).then(resp => {
      if (resp.exist) {
        return callback({
          message: t('Workspace name exists'),
          field: rule.field,
        })
      }
      callback()
    })
  }

  handleScrollToBottom = () => {
    if (
      !this.scrolling &&
      this.userStore.list.total > this.userStore.list.data.length
    ) {
      this.scrolling = true
      this.userStore
        .fetchList({
          more: true,
          page: this.userStore.list.page + 1,
        })
        .then(() => {
          this.scrolling = false
        })
    }
  }


  handleChange = value => {
    if (value === "Hosted") {
      this.isHosted = true
    } 
    if (value === "Baremetal") {
      this.isHosted = false
    }
  }

  getRack() {
    let res = []
    this.rackStore.list.data.filter(function(item) {
      if (item.isMaster) {
        res.push({label:item.rack_tag,value:item.rack_tag})
      }
    })
    return res
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
          <p>{"增加自定义K8S集群!"}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            controlClassName={styles.nameWrapper}
            label={"集群名称"}
            rules={[
              {
                required: true,
                message: "请输入集群名称.",
              },
              { validator: this.nameValidator },
            ]}
          >
            <Input name="clustrName" autoFocus={true} placeholder="请输入集群名称." />
          </Form.Item>
          <Form.Item 
            label={"集群类型"}
            rules={[
              {
                required: true,
                message: "请选择集群类型!",
              }]}
          >
           <Select
              name="ClusterType"
              searchable
              options={this.cluserType}
              onChange={this.handleChange}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
              isLoading={this.rackStore.list.isLoading}
            />
          </Form.Item>
          <Form.Item 
            label={"选择机柜"}
            rules={[
              {
                required: true,
                message: "请选择选择机柜!",
              }]}
          >
            <Select
              name="ClusterRack"
              searchable
              options={this.getRack()}
              onChange={this.handleChange}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
              isLoading={this.rackStore.list.isLoading}
            />
          </Form.Item>
          <Form.Item 
            label={"机柜号"}
            rules={[
              {
                required: true,
                message: "请输入机柜号!",
              }]}
          >
            <Input name="rack_tag" placeholder="请输入机柜号!" />
            {/* <Select
              name="spec.template.spec.networkIsolation"
              options={this.networkOptions}
              defaultValue={String(globals.config.defaultNetworkIsolation)}
            /> */}
          </Form.Item>
          {/* <Form.Item
            controlClassName={styles.textarea}
            label={t('Description')}
            desc={t('DESCRIPTION_DESC')}
          >
            <TextArea
              name="metadata.annotations['kubesphere.io/description']"
              maxLength={256}
              rows="3"
            />
          </Form.Item> */}
        </Form>
        {/* {this.renderFooter()} */}
      </div>
    )
  }
}
