// This page defintion Cluster Rack cidr !

import React from 'react'

import { Icon } from '@pitrix/lego-ui'
import { renderRoutes } from 'utils/router.config'
import { Nav } from 'components/Layout'

class Layout extends React.Component {
  render() {
    const { match, route, location } = this.props

    return (
      <div>
        <div className="ks-page-side">
          <div className="ks-page-side-title">
            <Icon name="cluster" size={40} />
            <div className="h3">{t('ClusterManage')}</div>
            <div className="ks-page-side-bottom" />
          </div>
          <Nav
            className="ks-page-nav"
            navs={globals.app.getSailorNavs()}
            location={location}
            match={match}
          />
        </div>
        <div className="ks-page-main">{renderRoutes(route.routes)}</div>
      </div>
    )
  }
}

export default Layout
