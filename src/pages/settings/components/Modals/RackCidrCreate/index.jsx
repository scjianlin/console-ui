
import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@pitrix/lego-ui'
import { Modal, Button } from 'components/Base'

import RouterStore from 'stores/router'

import Steps from './Steps'
import BaseInfo from './BaseInfo'

import styles from './index.scss'

export default class RackCidrCreateModal extends React.Component {
  static propTypes = {
    namespace: PropTypes.string,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    sampleApp: PropTypes.string,
  }

  static defaultProps = {
    visible: false,
    onOk() {},
    onCancel() {},
  }

  constructor(props) {
    super(props)

    this.state = {
      currentStep: 0,
      formTemplate: {
        // rackCidr: "",
        // rackCidrGw: "",
        // providerCidr: "",
        // rackTag: "",
        // isMaster: "",
        // podNum: "",
      }
    }

    this.formRef = React.createRef()

    this.routerStore = new RouterStore()
  }

  get steps() {
    return [
      {
        title: 'Basic Info',
        component: BaseInfo,
        required: true,
        isForm: true,
      },
    ]
  }

  handleOk = () => {
    if (Object.keys(this.state.formTemplate).length < 6) {
        this.handleNext()
    } else {
        this.props.onOk(this.state.formTemplate)
    }
  }

  handlePrev = () => {
    this.setState(({ currentStep }) => ({
      currentStep: Math.max(0, currentStep - 1),
    }))
  }

  handleNext = () => {
    const form = this.formRef.current
    form &&
      form.validate(() => {
        this.setState(({ currentStep }) => ({
          currentStep: Math.min(this.steps.length - 1, currentStep + 1),
        }))
      })
  }

  renderForm() {
    const { formTemplate, currentStep } = this.state
    const { onCancel, isSubmitting ,store} = this.props

    const step = this.steps[currentStep]
    const Component = step.component

    const props = {
      store,
      formTemplate,
    }

    if (step.isForm) {
      props.formRef = this.formRef
    } else {
      props.ref = this.formRef
    }
    const total = this.steps.length - 1

    return (
      <div className={styles.formWrapper}>
        <div className={styles.wrapper}>
          <div className={styles.form}>
            <Component {...props} />
          </div>
          <div className={styles.footer}>
          <div > 
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
      </div>
    )
  }

  renderHeader() {
    const { onCancel } = this.props
    const { currentStep } = this.state
    return (
      <div className={styles.header}>
        <div className={styles.title}>
          <Icon name="close" size={20} clickable onClick={onCancel} />
          <span />
          <Icon name="hammer" size={20} />
          <span>{"创建机柜网络"}</span>
        </div>
        <div className={styles.wrapper}>
          {this.steps.length > 1 && (
            <Steps steps={this.steps} current={currentStep} />
          )}
        </div>
        <div className={styles.headerBottom} />
      </div>
    )
  }

  renderFooter() {
    const { onCancel, isSubmitting } = this.props
    const { currentStep } = this.state

    return (
      // className={styles.wrapper}
      <div className={styles.footer}>
        <div > 
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
    const { visible } = this.props
    return (
      <Modal
        className={styles.modal}
        bodyClassName={styles.body}
        visible={visible}
        hideHeader
        hideFooter
        fullScreen
      >
        {this.renderHeader()}
        {this.renderForm()}
        {/* {this.renderFooter()} */}
      </Modal>
    )
  }
}
