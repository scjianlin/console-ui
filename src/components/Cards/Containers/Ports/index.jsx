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
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isEmpty } from 'lodash'

import { Panel } from 'components/Base'

import styles from './index.scss'

export default class ContainerPorts extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    ports: PropTypes.array,
  }

  static defaultProps = {
    ports: [],
  }

  renderContent() {
    const { ports } = this.props

    if (isEmpty(ports)) return null

    return (
      <div className={styles.content}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>{t('Name')}</th>
              <th>{t('Protocol')}</th>
              <th>{t('Port')}</th>
            </tr>
          </thead>
          <tbody>
            {ports.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.protocol}</td>
                <td>{item.containerPort}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  render() {
    const { className, loading, ...rest } = this.props
    const title = this.props.title || t('Ports')

    return (
      <Panel
        className={classnames(styles.card, className)}
        title={title}
        {...rest}
      >
        {this.renderContent()}
      </Panel>
    )
  }
}
