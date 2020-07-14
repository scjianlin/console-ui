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
import { toJS, when } from 'mobx'
import { observer, inject } from 'mobx-react'
import { Link } from 'react-router-dom'
import { get, isEmpty } from 'lodash'
import { Columns, Column } from '@pitrix/lego-ui'

import { Panel, Image } from 'components/Base'
import ApplicationStore from 'stores/openpitrix/application'

import styles from './index.scss'

@inject('rootStore')
@observer
export default class Applications extends React.Component {
  constructor(props) {
    super(props)
    this.store = new ApplicationStore()

    this.disposer = when(
      () => this.project.data.name === this.namespace,
      this.fetchData.bind(this)
    )
  }

  componentWillUnmount() {
    this.disposer && this.disposer()
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get namespace() {
    return get(this.props.match, 'params.namespace')
  }

  get project() {
    return this.props.rootStore.project
  }

  fetchData() {
    this.store.fetchList({
      namespace: this.namespace,
      runtime_id: get(this.project, 'data.annotations["openpitrix_runtime"]'),
      limit: 3,
    })
  }

  handleClickApp = e => {
    const { app } = e.currentTarget.dataset
    this.routing.push(
      `/projects/${this.namespace}/applications/template/${app}`
    )
  }

  handleImageOnError = e => {
    if (e.target.src !== '/assets/default-app.svg') {
      e.target.src = '/assets/default-app.svg'
    }
  }

  renderExtras() {
    return (
      <Link
        className={styles.more}
        to={`/projects/${this.namespace}/applications/template`}
      >
        {t('View All')}
      </Link>
    )
  }

  render() {
    const { data } = toJS(this.store.list)

    if (isEmpty(data)) {
      return null
    }

    return (
      <Panel
        className={styles.apps}
        title={`${t('Deployed Applications')}(Helm)`}
        extras={this.renderExtras()}
      >
        <Columns className="is-variable is-1">
          {data.map(item => {
            const icon = get(item, 'app.icon')
            const appName = get(item, 'app.name')

            return (
              <Column key={item.cluster_id} className="is-4">
                <div
                  className={styles.app}
                  data-app={item.cluster_id}
                  onClick={this.handleClickApp}
                >
                  <label className={styles.icon}>
                    <Image
                      iconLetter={appName}
                      iconSize={40}
                      src={icon}
                      onError={this.handleImageOnError}
                    />
                  </label>
                  <div className={styles.title}>
                    <div>{item.name}</div>
                    <p title={item.description}>{item.description || '-'}</p>
                  </div>
                </div>
              </Column>
            )
          })}
        </Columns>
      </Panel>
    )
  }
}
