
import React from 'react'
import { computed } from 'mobx'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import ClusterStore from 'stores/cluster'
import PodStore from 'stores/podcidr'

@withList({
  store: new PodStore(),
  module: 'settings',
  name: 'podcidr',
  rowKey: 'ID'
})

export default class PodCidr extends React.Component {
  clusterStore = new ClusterStore()

  componentDidMount() {
    this.clusterStore.fetchList({ limit: -1 })
  }

  @computed
  get clusters() {
    return this.clusterStore.list.data
  }

  get itemActions() {}

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
        title: '所属网络',
        // key: 'rackCidr',
        dataIndex: 'rackCidr',
        sorter: true,
        search: true,
      },      
      {
        title: '起始地址',
        dataIndex: 'rangeStart',
        isHideable: true,
      },
      {
        title: '结束地址',
        dataIndex: 'rangeEnd',
        isHideable: true,
      },
      {
        title: '所属机柜',
        dataIndex: 'rackTag',
        isHideable: true,
      },      
      {
        title: '默认路由',
        dataIndex: 'defaultRoute',
        isHideable: true,
      },
    ]
    return columns
  }

  render() {
    const { tableProps } = this.props
    const isClusterLoading = this.clusterStore.list.isLoading
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          icon="pod"
          title={"POD网络"}
          description={"规划IDC集群POD网络"}
        />
        <Table
          {...tableProps}
          columns={this.getColumns()}
          itemActions={this.itemActions}
          tableActions={this.tableActions}
          isClusterLoading={isClusterLoading}
          alwaysUpdate
        />
      </ListPage>
    )
  }
}
