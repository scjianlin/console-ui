
import React from 'react'
import { observer, inject } from 'mobx-react'

import Dashboard from './Dashboard'
import Initializing from './Initializing'

@inject('clusterStore')
@observer
export default class Overview extends React.Component {
  get cluster() {
    return this.props.clusterStore
  }

  render() {
    const { isReady } = this.cluster.detail

    if (!isReady) {
      return <Initializing store={this.cluster} />
    }

    return <Dashboard match={this.props.match} />
  }
}
