/*
 * This file is part of KubeSphere Console.
 * Copyright (C) 2019 The KubeSphere Console Authors.
 *
 * KubeSphere Console is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * KubeSphere Console is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
 */

import React from 'react'
import { get } from 'lodash'

import VersionList from 'apps/components/Lists/VersionList'

export default class VersionManage extends React.Component {
  render() {
    const { appId } = this.props.match.params
    const isAdmin = get(this.props.detailStore, 'isAdmin', false)

    return (
      <VersionList
        isAdmin={isAdmin}
        appStore={this.props.detailStore}
        versionStore={this.props.versionStore}
        appId={appId}
        params={this.props.match.params}
        appDetail={get(this.props.detailStore, 'detail', {})}
        title={t('Versions')}
        empty={t('No versions data')}
      />
    )
  }
}
