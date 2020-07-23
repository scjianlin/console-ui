
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import { Table } from '@pitrix/lego-ui'
import { Card } from 'components/Base'
import { getLocalTime } from 'utils'

import styles from './index.scss'

@inject('rootStore', 'detailStore')
@observer
export default class LoginHistory extends React.Component {
  get store() {
    return this.props.detailStore
  }

  getColumns = () => [
    {
      title: t('Time'),
      dataIndex: 'login_time',
      width: '50%',
      render: time => getLocalTime(time).format(`YYYY-MM-DD HH:mm:ss`),
    },
  ]

  renderContent() {
    const { conditions } = toJS(this.store.detail)

    return (
      <Table
        className={styles.table}
        dataSource={conditions}
        rowKey="login_time"
        columns={this.getColumns()}
      />
    )
  }

  render() {
    return (
      <Card title={t('Login History')} empty={t('No Login History')}>
        {this.renderContent()}
      </Card>
    )
  }
}
