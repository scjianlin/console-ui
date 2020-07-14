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

import { Form } from 'components/Base'
import Authorizations from './Authorizations'

import styles from './index.scss'

export default class AuthorizationSetting extends React.Component {
  render() {
    const { formRef, formTemplate, rulesInfo } = this.props

    return (
      <div className={styles.wrapper}>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            rules={[
              {
                required: true,
                message: t('Please specify role authorization'),
              },
            ]}
          >
            <Authorizations name="rules" rulesInfo={rulesInfo} />
          </Form.Item>
        </Form>
      </div>
    )
  }
}
