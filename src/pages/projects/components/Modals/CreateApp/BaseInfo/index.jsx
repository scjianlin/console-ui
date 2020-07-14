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

import { get, set, debounce } from 'lodash'
import React from 'react'
import { PropTypes } from 'prop-types'
import { Input, Select, TextArea } from '@pitrix/lego-ui'
import { PATTERN_NAME, PATTERN_LENGTH_63 } from 'utils/constants'
import { Form } from 'components/Base'

import styles from './index.scss'

export default class BaseInfo extends React.Component {
  static propTypes = {
    onLabelsChange: PropTypes.func,
  }

  static defaultProps = {
    onLabelsChange() {},
  }

  get governances() {
    return [
      { label: t('On'), value: 'true' },
      { label: t('Off'), value: 'false' },
    ]
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({ name: value, namespace: this.props.namespace })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  handleNameChange = debounce(value => {
    set(this.props.formData, 'metadata.labels["app.kubernetes.io/name"]', value)
    set(
      this.props.formData,
      'spec.selector.matchLabels["app.kubernetes.io/name"]',
      value
    )

    this.props.onLabelsChange(
      get(this.props.formData, 'spec.selector.matchLabels')
    )
  }, 200)

  handleVersionChange = debounce(value => {
    set(
      this.props.formData,
      'spec.selector.matchLabels["app.kubernetes.io/version"]',
      value
    )

    this.props.onLabelsChange(
      get(this.props.formData, 'spec.selector.matchLabels')
    )
  }, 200)

  handleGovernanceChange = value => {
    this.props.onGovernanceChange(value)
  }

  render() {
    const { formRef, serviceMeshEnable } = this.props

    return (
      <div className={styles.wrapper}>
        <div className="h5">{t('Basic Info')}</div>
        <Form data={this.props.formData} ref={formRef}>
          <Form.Item
            label={t('Application Name')}
            desc={t('NAME_DESC')}
            rules={[
              {
                required: true,
                message: t('Please input an application name'),
              },
              {
                pattern: PATTERN_NAME,
                message: `${t('Invalid name')}, ${t('NAME_DESC')}`,
              },
              { pattern: PATTERN_LENGTH_63, message: t('NAME_TOO_LONG') },
              { validator: this.nameValidator },
            ]}
          >
            <Input name="metadata.name" onChange={this.handleNameChange} />
          </Form.Item>
          <Form.Item
            label={t('Application Version(Optional)')}
            desc={t('Specify an application version')}
          >
            <Input
              name="metadata.labels['app.kubernetes.io/version']"
              onChange={this.handleVersionChange}
            />
          </Form.Item>
          <Form.Item
            label={t('Application Governance')}
            desc={t.html('APP_GOVERNANCE_DESC')}
          >
            <Select
              name="metadata.annotations['servicemesh.kubesphere.io/enabled']"
              options={this.governances}
              defaultValue={serviceMeshEnable ? 'true' : 'false'}
              onChange={this.handleGovernanceChange}
              disabled={!serviceMeshEnable}
            />
          </Form.Item>
          <Form.Item label={t('Description')}>
            <TextArea name="spec.descriptor.description" />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
