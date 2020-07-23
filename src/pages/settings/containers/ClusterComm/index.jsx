
import React from 'react'
import { computed } from 'mobx'
// import { observer, inject } from 'mobx-react'
// import { Avatar } from 'components/Base'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import ClusterWrapper from 'components/Clusters/ClusterWrapper'

// import WorkspaceStore from 'stores/workspace'
import ClusterStore from 'stores/cluster'
import RackStore from 'stores/rackcidr'

@withList({
  store: new RackStore(),
  module: 'settings',
  name: 'Workspace',
  rowKey: 'id'
})

export default class ClusterComm extends React.Component {
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
        show: this.showAction,
        onClick: item =>
          trigger('resource.baseinfo.edit', {
            detail: item,
            success: routing.query,
          }),
      },
      {
        key: 'delete',
        icon: 'trash',
        text: t('Delete'),
        action: 'delete',
        show: this.showAction,
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
      getCheckboxProps: record => ({
        disabled: false,
        name: record.name,
      }),
    }
  }

  getColumns = () => {
    // const { getSortOrder } = this.props
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        sorter: true,
      },
      {
        title: 'CIDR地址',
        key: 'rack_cidr',
        dataIndex: 'rack_cidr',
        sorter: true,
        //sortOrder: this.getSortOrder('rackCidr'),
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
    return this.props.trigger('rack.create', {
      success: getData,
    })
  }

  render() {
    const { tableProps } = this.props
    console.log("tableProps===>",tableProps);
    const isClusterLoading = this.clusterStore.list.isLoading
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          icon="hammer"
          title={"机柜网络"}
          description={"规划IDC集群机柜网络"}
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
