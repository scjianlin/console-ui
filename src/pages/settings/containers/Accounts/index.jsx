
import React from 'react'

import UserStore from 'stores/user'

import { Avatar, Status } from 'components/Base'
import Banner from 'components/Cards/Banner'
import Table from 'components/Tables/List'
import withList, { ListPage } from 'components/HOCs/withList'

import { getLocalTime } from 'utils'

@withList({
  store: new UserStore(),
  module: 'users',
  name: 'User',
})
export default class Accounts extends React.Component {
  showAction(record) {
    return (
      !globals.config.presetUsers.includes(record.name) &&
      globals.user.username !== record.name
    )
  }

  get itemActions() {
    const { trigger, getData, routing } = this.props
    return [
      {
        key: 'edit',
        icon: 'pen',
        text: t('Edit'),
        action: 'edit',
        show: this.showAction,
        onClick: item =>
          trigger('user.edit', {
            detail: item,
            success: getData,
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
            type: t('User'),
            resource: item.username,
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
      onCreate: this.showCreate,
      getCheckboxProps: record => ({
        disabled: !this.showAction(record),
        name: record.name,
      }),
    }
  }

  getColumns = () => [
    {
      title: t('Name'),
      dataIndex: 'username',
      search: true,
      render: (name, record) => (
        <Avatar
          avatar={record.avatar_url || '/assets/default-user.svg'}
          title={name}
          desc={record.email}
          to={`/access/accounts/${name}`}
        />
      ),
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      isHideable: true,
      width: '20%',
      render: status => (
        <Status type={status} name={t(`USER_${status.toUpperCase()}`)} />
      ),
    },
    {
      title: t('Account Role'),
      dataIndex: 'globalrole',
      isHideable: true,
      width: '20%',
      render: role => role || '-',
    },
    {
      title: t('Last login time'),
      dataIndex: 'last_login_time',
      isHideable: true,
      width: '20%',
      render: time =>
        time
          ? getLocalTime(time).format('YYYY-MM-DD HH:mm:ss')
          : t('Not logged in yet'),
    },
  ]

  showCreate = () =>
    this.props.trigger('user.create', {
      success: this.props.getData,
    })

  render() {
    const { bannerProps, tableProps } = this.props
    return (
      <ListPage {...this.props}>
        <Banner {...bannerProps} tabs={this.tabs} title={t('NAV_ACCOUNTS')} />
        <Table
          {...tableProps}
          tableActions={this.tableActions}
          itemActions={this.itemActions}
          columns={this.getColumns()}
          searchType="name"
        />
      </ListPage>
    )
  }
}
