/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { get, set, unset, cloneDeep } from 'lodash'
import { Columns, Column } from '@pitrix/lego-ui'
import { inject, observer } from 'mobx-react'
import { Button, Form } from 'components/Base'
import { ReactComponent as BackIcon } from 'src/assets/back.svg'

import ClusterStore from 'stores/cluster'

import BaseInfo from './BaseInfo'
import Configuration from './Configuration'
import styles from './index.scss'
import RackStore from 'stores/rackcidr'


@inject('rootStore')
@observer
export default class AddCluster extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ClusterStore()
    this.rack = new RackStore()
    this.rack.fetchList()
    this.state = {
      currentStep: 0,
      formTemplate: {}
    }
  }

  formRef = React.createRef()

  get steps() {
    return [
      {
        name: 'baseinfo',
        component: BaseInfo,
      },
      {
        name: 'configuration',
        component: Configuration,
      },
    ]
}

  routing = this.props.rootStore.routing

  handleImport = async data => {
    const postData = cloneDeep(data)
    this.store.create(postData)
    this.routing.push(`/clusters`)
  }

  handlePrev = () => {
    if (this.state.currentStep === 0) {
      this.routing.go(-1)
    } else {
      this.setState(({ currentStep }) => ({
        currentStep: Math.max(0, currentStep - 1),
      }))
    }
  }

  handleNext = () => {
    const form = this.formRef.current
      form.validate(() => {
        this.setState(({ currentStep }) => ({
          currentStep: Math.min(this.steps.length - 1, currentStep + 1),
        }))
      })
  }  

  renderForm() {
    const { currentStep, formTemplate } = this.state
    const step = this.steps[currentStep]
    const Component = step.component
    const props = {
      store: this.state,
      rackMaster: this.rack.list.data,
      formTemplate: formTemplate,
    }
    return <Component {...props} />
  }

  renderFooter() {
    const { currentStep } = this.state
    const total = this.steps.length - 1
    const { isValidating, isSubmitting } = this.store
    return (
      <div className={styles.footer}>
        {currentStep < total ? (
          <Button type="control" onClick={this.handleNext}>
            {t('Next')}
          </Button>
        ) : (
          <Button
            type="control"
            htmlType="submit"
            loading={isValidating || isSubmitting}
          >
            {isValidating ? t('Validating') : "创建"}
          </Button>
        )}
      </div>
    )
  }

  render() {
    const { formTemplate } = this.state
    return (
      <div className={styles.wrapper}>
        <div className={styles.back}>
          <a className="custom-icon" onClick={this.handlePrev}>
            <BackIcon />
            <span>{t('Go back')}</span>
          </a>
        </div>
        <div className={styles.title}>
          <div className="h4">{"创建Kubernetes集群"}</div>
          <p>{"现已支持裸金属和托管集群."}</p>
        </div>
        <Form
          data={formTemplate}
          ref={this.formRef}
          onSubmit={this.handleImport}
        >
          <Columns>
            <Column>{this.renderForm()}</Column>
            <Column className="is-narrow">{this.renderFooter()}</Column>
          </Columns>
        </Form>
      </div>
    )
  }
}
