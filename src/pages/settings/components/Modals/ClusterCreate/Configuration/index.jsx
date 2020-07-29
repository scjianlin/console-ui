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

import { debounce,cloneDeep } from 'lodash'
import React from 'react'
import { observer } from 'mobx-react'
import { Input,Select } from '@pitrix/lego-ui'
import { Form } from 'components/Base'
import FORM_TEMPLATES from 'utils/form.templates'
import { Button } from 'components/Base'
import UserStore from 'stores/user'

import styles from './index.scss'

@observer
export default class BaseInfo extends React.Component {
  constructor(props) {
    super(props)

    this.userStore = new UserStore()
    this.userStore.fetchList()
    this.state = {
      // currentStep: 2,
      formTemplate: cloneDeep(FORM_TEMPLATES['workspaces']()),
    }
  }

  getType() {
    const cluserType = [{
      label: "裸金属集群",
      value: "Baremetal",
    },{
      label: "全托管集群",
      value: "Hosted",
    }]

    return cluserType
  }

  get networkOptions() {
    return [
      { label: t('Off'), value: 'false' },
      { label: t('On'), value: 'true' },
    ]
  }

  nameValidator = (rule, value, callback) => {
    if (!value) {
      return callback()
    }

    if (value === 'workspaces') {
      return callback({
        message: t('current name is not available'),
        field: rule.field,
      })
    }

    this.props.store.checkName({ name: value }).then(resp => {
      if (resp.exist) {
        return callback({
          message: t('Workspace name exists'),
          field: rule.field,
        })
      }
      callback()
    })
  }

  handleScrollToBottom = () => {
    if (
      !this.scrolling &&
      this.userStore.list.total > this.userStore.list.data.length
    ) {
      this.scrolling = true
      this.userStore
        .fetchList({
          more: true,
          page: this.userStore.list.page + 1,
        })
        .then(() => {
          this.scrolling = false
        })
    }
  }

  handleInputChange = debounce(value => {
    // Workaround for search in select, should be fixed after lego-ui upgrade
    if (!value && this._select) {
      this._select = false
      return
    }

    this._search = true
    this.userStore.fetchList({ name: value })
  }, 300)

  handleChange = value => {
    this._select = true
    if (!value && this._search) {
      this.userStore.fetchList()
      this._search = false
    }
  }

  renderFooter() {
    const { onCancel, isSubmitting } = this.props
    // const { currentStep } = this.state

    // const total = 1
    return (
      <div className={styles.footer}>
        <div className={styles.wrapper}>
          <div className="text-right">
            <Button onClick={onCancel}>{t('Cancel')}</Button>
            {/* {currentStep > 0 && (
              <Button type="control" onClick={this.handlePrev}>
                {t('Previous')}
              </Button>
            )}
            {currentStep < total ? (
              <Button type="control" onClick={this.handleNext}>
                {t('Next')}
              </Button>
            ) : ( */}
              <Button
                type="control"
                onClick={this.handleOk}
                loading={isSubmitting}
              >
                {t('Create')}
              </Button>
            {/* )} */}
          </div>
        </div>
      </div>
    )
  }  

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <div className={styles.wrapper}>
        <div className={styles.step}>
          <div>{"集群配置"}</div>
          <p>{"增加集群配置"}</p>
        </div>
        <Form data={formTemplate} ref={formRef}>
          <Form.Item
            controlClassName={styles.nameWrapper}
            label={"集群名称"}
            rules={[
              {
                required: true,
                message: "请输入集群名称.",
              },
              { validator: this.nameValidator },
            ]}
          >
            <Input name="abc" autoFocus={true} placeholder="请输入集群名称." />
          </Form.Item>
          <Form.Item 
            label={"集群类型"}
            rules={[
              {
                required: true,
                message: "请选择集群类型!",
              }]}
          >
           <Select
              name="bc"
              searchable
              options={this.getType()}
              defaultValue={globals.user.username}
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
              isLoading={this.userStore.list.isLoading}
              bottomTextVisible={
                this.userStore.list.total === this.userStore.list.data.length
              }
              onMenuScrollToBottom={this.handleScrollToBottom}
            />
          </Form.Item>
          <Form.Item label={"所属网络"}>
            <Input name="sssss" placeholder="请输入所属网络地址!" />
            {/* <Select
              name="spec.template.spec.manager"
              searchable
              options={this.getUsers()}
              defaultValue={globals.user.username}
              onChange={this.handleChange}
              onInputChange={this.handleInputChange}
              onBlurResetsInput={false}
              onCloseResetsInput={false}
              openOnClick={true}
              isLoadingAtBottom
              isLoading={this.userStore.list.isLoading}
              bottomTextVisible={
                this.userStore.list.total === this.userStore.list.data.length
              }
              onMenuScrollToBottom={this.handleScrollToBottom}
            /> */}
          </Form.Item>
          <Form.Item 
            label={"机柜号"}
            rules={[
              {
                required: true,
                message: "请输入机柜号!",
              }]}
          >
            <Input name="sdfsdf" placeholder="请输入机柜号!" />
            {/* <Select
              name="spec.template.spec.networkIsolation"
              options={this.networkOptions}
              defaultValue={String(globals.config.defaultNetworkIsolation)}
            /> */}
          </Form.Item>
          {/* <Form.Item
            controlClassName={styles.textarea}
            label={t('Description')}
            desc={t('DESCRIPTION_DESC')}
          >
            <TextArea
              name="metadata.annotations['kubesphere.io/description']"
              maxLength={256}
              rows="3"
            />
          </Form.Item> */}
        </Form>
        {/* {this.renderFooter()} */}
      </div>
    )
  }
}
