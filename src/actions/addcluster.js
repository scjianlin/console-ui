
import { toJS } from 'mobx'
import { Modal, Notify } from 'components/Base'
import CreateModal from 'settings/components/Modals/ClusterCreate'
import EditModal from 'settings/components/Modals/EditCluster'

export default {
  'cluster.create': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }
          store.create(data).then(() => {
            Modal.close(modal)
            Notify.success({ content: `${t('Created Successfully')}!` })
            success && success()
          })
        },
        modal: CreateModal,
        store,
        ...props,
      })
    },
  },
  'cluster.delete': {
    on({ store, data,success}) {
      store.delete(data)
      Notify.success({ content: `${t('Deleted Successfully')}!` })
      store.setSelectRowKeys([])
      success && success()
    },
  },
  // 'cluster.edit': {
  //   on({ store, detail, success, ...props }) {
  //     const modal = Modal.open({
  //       onOk: data => {
  //         store.patch(detail, data).then(() => {
  //           Modal.close(modal)
  //           success && success()
  //         })
  //       },
  //       detail: toJS(detail._originData || detail),
  //       modal: EditModal,
  //       store,
  //       ...props,
  //     })
  //   },
  // },
}
