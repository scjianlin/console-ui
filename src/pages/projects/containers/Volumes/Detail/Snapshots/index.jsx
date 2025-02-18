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

import React, { Component } from 'react'
import { Card } from 'components/Base'
import { observer, inject } from 'mobx-react'
import { Icon, Pagination, LevelRight, Level, LevelLeft } from '@pitrix/lego-ui'
import VolumeSnapshotStore from 'stores/volumeSnapshot'
import { Link } from 'react-router-dom'
import moment from 'moment-mini'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class PVCSnapshots extends Component {
  store = new VolumeSnapshotStore()

  componentDidMount() {
    const { detailStore } = this.props
    const { cluster, namespace, name } = detailStore.detail
    // this.store.fetchList({
    //   cluster,
    //   namespace,
    //   persistentVolumeClaimName: name,
    // })
  }

  handlePagination = page => {
    this.store.fetchList({ page })
  }

  renderSnapshot(snapshot) {
    const {
      name,
      snapshotClassName,
      backupStatus,
      createTime,
      restoreSize,
      uid,
      namespace,
    } = snapshot

    const status = t(`CREATE_STATUS_${backupStatus.toUpperCase()}`)
    const { detailStore } = this.props
    const { workspace } = this.props.match.params
    const { cluster } = detailStore.detail

    return (
      <div className={styles.item} key={uid}>
        <Icon name={'snapshot'} size={40} />
        <div className={styles.itemAttrs}>
          <h3>
            <Link
              to={`${
                workspace ? `/${workspace}` : ''
              }/clusters/${cluster}/projects/${namespace}/volume-snapshots/${name}`}
            >
              {name}
            </Link>
          </h3>
          <p>{snapshotClassName}</p>
        </div>
        <div className={styles.itemAttrs}>
          <h3>{status}</h3>
          <p>{t('Status')}</p>
        </div>
        <div className={styles.itemAttrs}>
          <h3>{restoreSize || '-'}</h3>
          <p>{t('Capacity')}</p>
        </div>
        <div className={styles.itemAttrs}>
          <h3>{moment(createTime).format('YYYY-MM-DD HH:mm:ss')}</h3>
          <p>{t('Create Time')}</p>
        </div>
      </div>
    )
  }

  render() {
    const { total, page, limit, data } = this.store.list

    return (
      <Card title={t('Snapshot Message')}>
        <div className={styles.snapshotList}>
          {total === 0 ? (
            <div>{t('NO_RESOURCE', { resource: t('Volume Snapshot') })}</div>
          ) : (
            data.map(this.renderSnapshot, this)
          )}
        </div>
        {page > 1 && (
          <Level>
            <LevelLeft />
            <LevelRight>
              <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={this.handlePagination}
              />
            </LevelRight>
          </Level>
        )}
      </Card>
    )
  }
}
