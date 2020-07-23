
import { groupBy } from 'lodash'
import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'

import { Card } from 'components/Base'
import RuleList from 'components/Cards/RuleList'

@inject('detailStore')
@observer
export default class AuthorizationList extends React.Component {
  render() {
    const { detail, roleTemplates, isLoading } = toJS(this.props.detailStore)

    const templates = groupBy(
      roleTemplates.data.filter(rt => detail.roleTemplates.includes(rt.name)),
      'annotations["iam.kubesphere.io/module"]'
    )

    return (
      <Card
        title={t('Authorization List')}
        empty={t('No Authorization')}
        loading={isLoading}
        isEmpty={detail.roleTemplates.length <= 0}
      >
        <RuleList templates={templates} />
      </Card>
    )
  }
}
