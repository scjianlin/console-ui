
import React from 'react'
import { toJS } from 'mobx'
import { inject, observer } from 'mobx-react'

import { getLocalTime } from 'utils'
import { ROLE_QUERY_KEY } from 'utils/constants'
import { Panel, Status } from 'components/Base'
import Table from 'components/Tables/Base'

import UserStore from 'stores/user'

import styles from './index.scss'

@inject('detailStore')
@observer
export default class AuthorizedUsers extends React.Component {
  store = new UserStore()

  componentDidMount() {
    this.fetchData()
  }

  fetchData = (params = {}) => {
    const { name, namespace, workspace, cluster } = this.props.match.params
    const { module } = this.props.detailStore
    this.store.fetchList({
      [ROLE_QUERY_KEY[module]]: name,
      namespace,
      workspace,
      cluster,
      ...params,
    })
  }

  getColumns = () => [
    {
      title: t('User Name'),
      dataIndex: 'username',
      width: '33%',
    },
    {
      title: t('Status'),
      dataIndex: 'status',
      width: '33%',
      render: status => (
        <Status type={status} name={t(`USER_${status.toUpperCase()}`)} />
      ),
    },
    {
      title: t('Last Login Time'),
      dataIndex: 'last_login_time',
      width: '33%',
      render: login_time => (
        <p>
          {login_time
            ? getLocalTime(login_time).format('YYYY-MM-DD HH:mm:ss')
            : t('Not logged in yet')}
        </p>
      ),
    },
  ]

  get emptyProps() {
    return {
      icon: 'human',
      name: 'Users',
      desc: t('NO_AUTHORIZED_USERS'),
    }
  }

  render() {
    const { data, total, page, limit, isLoading } = toJS(this.store.list)

    const pagination = { total, page, limit }

    return (
      <Panel title={t('Authorized Users')}>
        <Table
          className={styles.table}
          data={data}
          columns={this.getColumns()}
          pagination={pagination}
          isLoading={isLoading}
          onFetch={this.fetchData}
          emptyProps={this.emptyProps}
          hideCustom
          hideHeader
        />
      </Panel>
    )
  }
}
