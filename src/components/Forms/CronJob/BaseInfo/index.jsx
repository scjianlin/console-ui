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
import { Columns, Column, Input, TextArea, Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import { NumberInput, SelectInput } from 'components/Inputs'
import ToggleView from 'components/ToggleView'
import {
  MODULE_KIND_MAP,
  PATTERN_LENGTH_52,
  PATTERN_NAME,
} from 'utils/constants'

export default class BaseInfo extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  get namespace() {
    return get(this.formTemplate, 'metadata.namespace')
  }

  getCronOptions() {
    return [
      { label: `0 * * * * (${t('Every Hour')})`, value: '0 * * * *' },
      { label: `0 0 * * * (${t('Every Day')})`, value: '0 0 * * *' },
      { label: `0 0 * * 0 (${t('Every Week')})`, value: '0 0 * * 0' },
      { label: `0 0 1 * * (${t('Every Month')})`, value: '0 0 1 * *' },
    ]
  }

  handleNameChange = debounce(value => {
    const labels = get(this.formTemplate, 'metadata.labels', {})
    labels.app = value

    set(this.formTemplate, 'spec.jobTemplate.metadata.labels', labels)
  }, 200)

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    this.props.store
      .checkName({ name: value, namespace: this.namespace })
      .then(resp => {
        if (resp.exist) {
          return callback({ message: t('Name exists'), field: rule.field })
        }
        callback()
      })
  }

  getConcurrencyPolicyOptions = () => [
    { label: 'Allow', value: 'Allow' },
    { label: 'Forbid', value: 'Forbid' },
    { label: 'Replace', value: 'Replace' },
  ]

  render() {
    const { formRef } = this.props

    return (
      <Form data={this.formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={t('Name')}
              desc={t('CRONJOB_NAME_DESC')}
              rules={[
                { required: true, message: t('Please input name') },
                {
                  pattern: PATTERN_NAME,
                  message: `${t('Invalid name')}, ${t('CRONJOB_NAME_DESC')}`,
                },
                {
                  pattern: PATTERN_LENGTH_52,
                  message: t('CRONJOB_NAME_TOO_LONG'),
                },
                { validator: this.nameValidator },
              ]}
            >
              <Input
                name="metadata.name"
                onChange={this.handleNameChange}
                autoFocus={true}
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item label={t('Alias')} desc={t('ALIAS_DESC')}>
              <Input name="metadata.annotations['kubesphere.io/alias-name']" />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item label={t('Description')}>
              <TextArea name="metadata.annotations['kubesphere.io/description']" />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={t('Schedule')}
              desc={t.html('CRONJOB_CRON_DESC')}
              rules={[{ required: true, message: t('Please input schedule') }]}
            >
              <SelectInput
                name="spec.schedule"
                options={this.getCronOptions()}
              />
            </Form.Item>
          </Column>
        </Columns>
        <ToggleView>
          <Columns className="margin-t8">
            <Column>
              <Form.Item
                label={t('startingDeadlineSeconds(s)')}
                desc={t('START_DEADLINE_SECONDS_DESC')}
              >
                <NumberInput
                  min={0}
                  name="spec.startingDeadlineSeconds"
                  integer
                />
              </Form.Item>
              <Form.Item
                label={t('failedJobsHistoryLimit')}
                desc={t('Number of failed jobs allowed to be retained')}
              >
                <NumberInput
                  min={0}
                  name="spec.failedJobsHistoryLimit"
                  integer
                />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item
                label={t('successfulJobsHistoryLimit')}
                desc={t('Number of success jobs allowed to be retained')}
              >
                <NumberInput
                  min={0}
                  name="spec.successfulJobsHistoryLimit"
                  integer
                />
              </Form.Item>
              <Form.Item
                label={t('concurrencyPolicy')}
                desc={t('Concurrency policy settings')}
              >
                <Select
                  name="spec.concurrencyPolicy"
                  options={this.getConcurrencyPolicyOptions()}
                />
              </Form.Item>
            </Column>
          </Columns>
        </ToggleView>
      </Form>
    )
  }
}
