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

import { isEmpty } from 'lodash'
import React from 'react'
import { observer, inject } from 'mobx-react'
import { Loading, Pagination } from '@pitrix/lego-ui'
import { Button, Search } from 'components/Base'
import Banner from 'components/Cards/Banner'
import EmptyList from 'components/Cards/EmptyList'
import ClusterCard from 'clusters/components/Cards/Cluster'
import ClusterStore from 'stores/cluster'

import styles from './index.scss'

@inject('rootStore')
@observer
class Clusters extends React.Component {
  constructor(props) {
    super(props)

    this.store = new ClusterStore()
    this.hostStore = new ClusterStore()
  }

  componentDidMount() {
    this.fetchHostData()
    this.fetchData()
  }

  get authKey() {
    return 'clusters'
  }

  get enabledActions() {
    return globals.app.getActions({
      module: this.authKey,
    })
  }

  get routing() {
    return this.props.rootStore.routing
  }

  fetchData = (params = {}) => {
    this.store.fetchMemberList({
      ...params,
      limit: 10,
      labelSelector: 'member',
    })
  }

  fetchHostData = (params = {}) => {
    this.hostStore.fetchList({
      ...params,
      labelSelector: 'meta',
      limit: -1,
    })
  }

  showAddCluster = () => {
    this.routing.push('/clusters/add')
  }

  handlePagination = page => {
    this.fetchData({ page })
  }

  handleRefresh = () => {
    this.fetchData({ page: 1 })
  }

  handleSearch = name => {
    this.fetchData({ name })
    this.fetchHostData({ name })
  }

  enterCluster = async cluster => {
    this.routing.push(`/clusters/${cluster}/overview`)
  }

  renderList() {
    const { data, page, total, limit, filters, isLoading } = this.store.list
    const {
      data: hostClusters,
      isLoading: isHostLoading,
      filters: hostFilters,
    } = this.hostStore.list
    if (
      isEmpty(data) &&
      !isLoading &&
      isEmpty(filters) &&
      !isHostLoading &&
      isEmpty(hostFilters) &&
      isEmpty(hostClusters)
    ) {
      return (
        <EmptyList
          icon="cluster"
          title={t('NO_CLUSTER_TIP')}
          desc={t('NO_CLUSTER_TIP_DESC')}
          actions={
            this.enabledActions.includes('create') ? (
              <Button type="control" onClick={this.showAddCluster}>{t('Add Cluster')}</Button>
            ) : null
          }
        />
      )
    }

    if (isLoading || isHostLoading) {
      return <Loading className={styles.loading} />
    }

    if (
      !isLoading &&
      isEmpty(data) &&
      !isHostLoading &&
      isEmpty(hostClusters)
    ) {
      return (
        <>
          <div className="h6 margin-b12">
            {t('Cluster List')} <span className={styles.total}>{total}</span>
          </div>
          <div className={styles.noData}>
            <img src="/assets/empty-card.svg" alt="" />
            <p>{t('RESOURCE_NOT_FOUND')}</p>
          </div>
        </>
      )
    }

    return (
      <ul className={styles.cards}>
        {!isEmpty(hostClusters) && (
          <div className="margin-b12">
            <div className="h6">
              {hostClusters.length > 1 ? "Meta集群" : "Meta集群"}
            </div>
            {hostClusters.map(item => (
              <ClusterCard
                key={item.name}
                data={item}
                onEnter={this.enterCluster}
              />
            ))}
          </div>
        )}
        {!isEmpty(data) && (
          <div>
            <div className="h6">
              {t('Member Clusters')}{' '}
              <span className={styles.total}>{total}</span>
            </div>
            {data.map(item => (
              <ClusterCard
                key={item.name}
                data={item}
                onEnter={this.enterCluster}
              />
            ))}
            <div className="text-right margin-t12">
              <Pagination
                current={page}
                total={total}
                pageSize={limit}
                onChange={this.handlePagination}
              />
            </div>
          </div>
        )}
      </ul>
    )
  }

  renderSearch() {
    return (
      <div className={styles.searchPanel}>
        <Search
          className={styles.search}
          onSearch={this.handleSearch}
          placeholder={t('Please input a keyword to find')}
        />
        <Button
          type="flat"
          icon="refresh"
          onClick={this.handleRefresh}
          data-test="cluster-refresh"
        />
        {this.enabledActions.includes('create') && (
          <Button
            type="control"
            onClick={this.showAddCluster}
            data-test="cluster-create"
          >
            {t('Add Cluster')}
          </Button>
        )}
      </div>
    )
  }

  render() {
    return (
      <div className={styles.wrapper}>
        <Banner
          className={styles.banner}
          icon="cluster"
          title={t('Clusters Management')}
          description={t('CLUSTERS_MANAGE_DESC')}
          extra={this.renderSearch()}
        />
        {this.renderList()}
      </div>
    )
  }
}

export default Clusters
