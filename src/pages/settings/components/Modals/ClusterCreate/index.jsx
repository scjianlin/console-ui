
import React from 'react'
import PropTypes from 'prop-types'
import { Modal, Button } from 'components/Base'
import Steps from './Steps'
import BaseInfo from './BaseInfo'
import Configuration from './Configuration'
import styles from './index.scss'

export default class ClusterCreateModal extends React.Component {
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
        // clustrName:"",
        // ClusterType:"",
        // ClusterRack:"",
        // ClusterIP:"",
        // ClusterUser:"",
        // UserPass: "",
        // ClusterVersion:"",
        // DockerVersion:"",
        // InitTemplate:"",
        // CustomScript:"",
      }
    }

    this.formRef = React.createRef()

  }

  get steps() {
    return [
      {
        title: 'Basic Info',
        component: BaseInfo,
        required: true,
        isForm: true,
      },
      {
        title: 'Configuration',
        component: Configuration,
        required: true,
        isForm: true,
      },
    ]
  }

  handleOk = () => {
    let checkNum = 0
    if (this.state.formTemplate.clusterTyoe=="Baremetal") {
      checkNum = Object.keys(this.state.formTemplate).length - 1
    } else {
      checkNum = Object.keys(this.state.formTemplate).length - 2
    }
    if (Object.keys(this.state.formTemplate).length < checkNum) {
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

    const total = this.steps.length - 1

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
    const { currentStep } = this.state
    return (
      <div className={styles.header}>
        <div className={styles.wrapper}>
          {this.steps.length > 1 && (
            <Steps steps={this.steps} current={currentStep} />
          )}
        </div>
        <div className={styles.headerBottom} />
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
      </Modal>
    )
  }
}
