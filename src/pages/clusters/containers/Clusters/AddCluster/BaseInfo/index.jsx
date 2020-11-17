
import React from 'react'
import { Icon, Input,Select } from '@pitrix/lego-ui'
import {
  PATTERN_NAME,
  CLUSTER_GROUP_TAG_TYPE,
  CLUSTER_TYPE,
  CLUSTER_PRESET_GROUPS,
} from 'utils/constants'
import { Form, Tag, TextArea } from 'components/Base'
import { SelectInput } from 'components/Inputs'

import SubTitle from '../SubTitle'

export default class BaseInfo extends React.Component {
  groupOptionRenderer = option => (
    <>
      <Tag type={CLUSTER_GROUP_TAG_TYPE[option.value]}>
        {t(`ENV_${option.label.toUpperCase()}`)}
      </Tag>
      &nbsp;&nbsp;
      {option.label}
    </>
  )

  providerOptionRenderer = option => (
    <>
      <Icon name={option.icon} type="light" size={20} />
      {option.label}
    </>
  )

  getRack() {
    const {rackMaster} = this.props
    let res = []
    rackMaster.filter(function(item) {
      if (item.isMaster==1) {
        res.push({label:item.rackTag,value:item.rackTag})
      }
    })
    return res
  }  

  render() {
    return (
      <div>
        <SubTitle
          title={"基础设置"}
          description={"管理集群设置，编辑集群信息，，设置集群的环境等等."}
        />
        <Form.Item
          label={t('Cluster Name')}
          desc={t('NAME_DESC')}
          rules={[
            { required: true, message: t('Please input cluster name') },
            {
              pattern: PATTERN_NAME,
              message: `${t('Invalid name')}, ${t('NAME_DESC')}`,
            },
          ]}
        >
          <Input name="clusterName" />
        </Form.Item>
        <Form.Item label={t('CLUSTER_TAG')} desc={t('CLUSTER_TAG_DESC')}>
          <SelectInput
            name="clusterGroup"
            options={CLUSTER_PRESET_GROUPS}
            placeholder={t('Please select or input a tag')}
            optionRenderer={this.groupOptionRenderer}
          />
        </Form.Item>
        <Form.Item 
          label={"集群类型"}
          rules={[
            {
              required: true,
              message: "请选择集群类型",
            }]}
        >
          <Select
            name="clusterType"
            searchable
            options={CLUSTER_TYPE}
            onBlurResetsInput={false}
            onCloseResetsInput={false}
            openOnClick={true}
            isLoadingAtBottom
          />
        </Form.Item>
        <Form.Item
            label={"选择机柜"}
            rules={[
              {
                required: true,
                message: "请选择选择机柜",
              }]}
          >
            <Select
              name="clusterRack"
              searchable
              multi
              options={this.getRack()}
            />
          </Form.Item>
        <Form.Item label={t('Description')} desc={t('DESCRIPTION_DESC')}>
          <TextArea
            name="description"
            maxLength={256}
          />
        </Form.Item>
      </div>
    )
  }
}
