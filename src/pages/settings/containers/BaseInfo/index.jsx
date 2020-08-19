import React, { Component } from 'react'
import { Panel, Text } from 'components/Base'
import Banner from 'components/Cards/Banner'
import { getDocsUrl } from 'utils'

import styles from './index.scss'

export default class BaseInfo extends Component {
  state = {
    showEdit: false,
  }

  showEdit = () => {
    this.setState({ showEdit: true })
  }

  hideEdit = () => {
    this.setState({ showEdit: false })
  }

  handleEdit = () => {}

  render() {
    return (
      <div>
        <Banner
          icon="home"
          title={t('Platform Info')}
          description={t('PLATFORM_INFO_DESC')}
        />
        <Panel title={t('Basic Info')}>
          {/* <div className={styles.header}>
            <Text
              icon="image"
              title={location.host}
              description={t('Platform URL')}
            />
          </div> */}
          <div className={styles.content}>
            <div className={styles.image}>
              <img src="/assets/ks.png" alt="" />
            </div>
          </div>
        </Panel>
      </div>
    )
  }
}