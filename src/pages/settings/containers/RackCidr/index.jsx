
import React from 'react'
import { computed } from 'mobx'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'

import ClusterStore from 'stores/cluster'
import RackStore from 'stores/rackcidr'

@withList({
  store: new RackStore(),
  module: 'settings',
  name: 'rackcidr',
  rowKey: 'rackCidr'
})

export default class ClusterComm extends React.Component {
  clusterStore = new ClusterStore()

  componentDidMount() {
    this.clusterStore.fetchList({ limit: -1 })
  }

  // @computed
  // get clusters() {
  //   return this.clusterStore.list.data
  // }

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
        key: 'rackCidr',
        dataIndex: 'rackCidr',
        sorter: true,
        search: true,
      },      
      {
        title: '网关地址',
        dataIndex: 'rackCidrGw',
        isHideable: true,
      },
      {
        title: '所属网络',
        dataIndex: 'providerCidr',
        isHideable: true,
      },
      {
        title: 'POD数量',
        dataIndex: 'podNum',
        isHideable: true,
      },      
      {
        title: '是否为Master机柜',
        dataIndex: 'isMaster',
        isHideable: true,
        render: isMaster => (
          isMaster == 1 ? "是" : "否"
        ),
      },
      {
        title: '机柜号',
        dataIndex: 'rackTag',
        isHideable: true,
      },            
    ]
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
          alwaysUpdate
        />
      </ListPage>
    )
  }
}
