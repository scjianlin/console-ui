
import React from 'react'
import Banner from 'components/Cards/Banner'
import withList, { ListPage } from 'components/HOCs/withList'
import Table from 'components/Tables/List'
import AddClusterStore from 'stores/addcluster'

@withList({
  store: new AddClusterStore(),
  module: 'settings',
  name: 'addcluster',
  rowKey: 'clustrName'
})
export default class AddCluster extends React.Component {
  get itemActions() {
    const { name, routing, trigger } = this.props
    return [
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
        title: '集群名称',
        key: 'clustrName',
        dataIndex: 'clustrName',
        sorter: true,
        search: true,
      },      
      {
        title: '集群类型',
        dataIndex: 'clusterType',
        isHideable: true,
      },
      {
        title: '集群版本',
        dataIndex: 'clusterVersion',
        isHideable: true,
      },
      {
        title: '容器版本',
        dataIndex: 'dockerVersion',
        isHideable: true,
      },
      {
        title: '集群IP',
        dataIndex: 'clusterIp',
        isHideable: true,
      },
    ]
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
    return (
      <ListPage {...this.props} noWatch>
        <Banner
          icon="cluster"
          title={"添加集群"}
          description={"创建自定义集群"}
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
