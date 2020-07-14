/*
This  page definition  RackCidr store
 */

import React from 'react'
import { observer, inject } from 'mobx-react'
import { get, includes } from 'lodash'

import FORM_STEPS from 'configs/steps/storageclasses'
import FORM_TEMPLATES from 'utils/form.templates'
import { ICON_TYPES, MODULE_KIND_MAP } from 'utils/constants'
import RackStore from 'stores/rackCidr'

import { Notify, Avatar } from 'components/Base'
import CreateModal from 'components/Modals/Create'
import Banner from 'components/Cards/Banner'
import Base from 'core/containers/Base/List'

@inject('rootStore')
@observer
class RackCidr extends Base {
  init() {
    this.store = new RackStore()
    
    this.state = {
      selectStorageClass: {},
    }
  }

  get module() {
    // return 'storageclasses'
    return 'getRackCidr'
  }

  get name() {
    return 'Rack'
  }

  get title() {
    return 'Rack'
  }

  get formTemplate() {
    const kind = MODULE_KIND_MAP[this.module]

    if (!kind) {
      return {}
    }

    const template = FORM_TEMPLATES[this.module]()

    return {
      [kind]: template,
    }
  }

  get steps() {
    return FORM_STEPS
  }

  get quotas() {
    const { data, total } = this.store.list

    const defaultStorageClass = data.find(item => item.default) || {}

    return [
      { name: t('Storage Class'), value: total },
      {
        name: t('Default Storage Class'),
        value: defaultStorageClass.name || '-',
      },
    ]
  }

  getColumns = () => [
    {
      title: 'ID',
      dataIndex: 'id',
      isHideable: false,
    },
    {
      title: 'CIDR地址',
      key: 'rackCidr',
      dataIndex: 'rackCidr',
      sorter: true,
      sortOrder: this.getSortOrder('rackCidr'),
      search: true,
      // render: name => (
      //   <Avatar
      //     icon={ICON_TYPES[this.module]}
      //     to={`${this.prefix}/${name}`}
      //     title={name}
      //   />
      // ),
    },
    {
      title: '网关地址',
      dataIndex: 'rackCidrGw',
      isHideable: true,
    },

    {
      title: '所属网络',
      dataIndex: 'providerCidr',
      isHideable: true,
    },
    {
      title: '机柜号',
      dataIndex: 'rackTag',
      isHideable: true,
    },    
  ]

  renderExtraModals() {
    const { createModal } = this.state

    return (
      <CreateModal
        name={this.name}
        module={this.module}
        store={this.store}
        visible={createModal}
        steps={this.steps}
        formTemplate={this.formTemplate}
        isSubmitting={this.store.isSubmitting}
        onOk={this.handleCreate}
        onCancel={this.hideModal('createModal')}
      />
    )
  }

  renderHeader() {
    return (
      <Banner
        className="margin-b12"
        title={t(this.title)}
        description={t(`${this.name.toUpperCase()}_DESC`)}
        quotas={this.quotas}
        module={this.module}
      />
    )
  }

  getTableProps() {
    const props = super.getTableProps()

    return {
      ...props,
      selectActions: [
        {
          key: 'delete',
          type: 'danger',
          text: t('Delete'),
          action: 'delete',
          onClick: this.validateSelect({
            callback: this.showModal('batchDeleteModal'),
          }),
        },
      ],
    }
  }

  validateSelect({ callback }) {
    return (...args) => {
      const { selectedRowKeys, data } = this.list
      const dependent = data.some(
        storageClass =>
          includes(selectedRowKeys, storageClass.name) &&
          storageClass.associationPVCCount
      )

      return dependent ? this.notifyDeleteTips() : callback(...args)
    }
  }

  notifyDeleteTips() {
    Notify.error({ content: `${t('DEPENDENT_STORAGE_CLASS_DELETE_TIPS')}!` })
  }
}

export default RackCidr
