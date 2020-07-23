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
import { get } from 'lodash'
import {  Input } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import { MODULE_KIND_MAP } from 'utils/constants'

export default class BaseInfo extends React.Component {
  get formTemplate() {
    const { formTemplate, module } = this.props
    console.log("formTemplate==>",formTemplate,module);
    return get(formTemplate, MODULE_KIND_MAP[module], formTemplate)
  }

  render() {
    const { formRef } = this.props
    return (
      <div>
        <Form data={this.formTemplate} ref={formRef}>
          <Form.Item label="机柜网络地址" rules={[{ required: true, message: t('Please input name') }]} >
            <Input name="metadata.name" autoFocus={true} />
          </Form.Item>
          <Form.Item label="网关地址" rules={[{ required: true, message: t('Please input name') }]} >
            <Input name="metadata.name" autoFocus={true} />
          </Form.Item>
          <Form.Item label="提供者网络" rules={[{required: true, message: "请输入提供者网络地址!"}]}>
            <Input name="metadata.provider" autoFocus={true} />
          </Form.Item>
          <Form.Item label="机柜编号" rules={[{required: true, message: "请输入机柜编号!"}]}>
            <Input name="metadata.rack_tag" autoFocus={true} />
          </Form.Item>          
        </Form>
      </div>
    )
  }
}
