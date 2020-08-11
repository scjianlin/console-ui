
import React from 'react'
import { computed } from 'mobx'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import ClusterWrapper from 'components/Clusters/ClusterWrapper'

import ClusterStore from 'stores/cluster'

import AddClusterStore from 'stores/addcluster'

@withList({
  store: new AddClusterStore(),
  module: 'settings',
  name: 'addcluster',
  rowKey: 'rack_cidr'
})
export default class AddCluster extends React.Component {
  clusterStore = new ClusterStore()

  componentDidMount() {
    this.clusterStore.fetchList({ limit: -1 })
  }

  @computed
  get clusters() {
    return this.clusterStore.list.data
  }

  showAction(record) {
    return globals.config.systemWorkspace !== record.name
  }

  get itemActions() {
    const { name, routing, trigger } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        onClick: item =>
          trigger('rack.edit', {
            detail: item,
            success: routing.query,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        onClick: item =>
          trigger('resource.delete', {
            type: t(name),
            resource: item.name,
            detail: item,
            success: routing.query,
          }),
      },
    ]
  }

  get tableActions() {
    const { tableProps } = this.props
    return {
      ...tableProps.tableActions,
      selectActions: [],
      getCheckboxProps: record => ({
        disabled: false,
        name: record.name,
      }),
    }
  }

  getColumns = () => {
    const columns = [
      {
        title: 'CIDR地址',
        key: 'rack_cidr',
        dataIndex: 'rack_cidr',
        sorter: true,
        search: true,
      },      
      {
        title: '网关地址',
        dataIndex: 'rack_cidr_gw',
        isHideable: true,
      },
      {
        title: '所属网络',
        dataIndex: 'provider_cidr',
        isHideable: true,
      },
      {
        title: '机柜号',
        dataIndex: 'rack_tag',
        isHideable: true,
      },
    ]

    if (globals.app.isMultiCluster) {
      columns.splice(1, 0, {
        title: t('Cluster Info'),
        dataIndex: 'clusters',
        width: '30%',
        render: clusters => (
          <ClusterWrapper clusters={clusters} clustersDetail={this.clusters} />
        ),
      })
    }

    return columns
  }

  showCreate = () => {
    const { getData } = this.props
    return this.props.trigger('cluster.create', {
      success: getData,
    })
  }

  render() {
    const { tableProps } = this.props
    const isClusterLoading = this.clusterStore.list.isLoading
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          icon="cluster"
          title={"添加节点"}
          description={"创建节点"}
        />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          onCreate={this.showCreate}
          isClusterLoading={isClusterLoading}
          alwaysUpdate
        />
      </ListPage>
    )
  }
}
