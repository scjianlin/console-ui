
import { get, set } from 'lodash'
import { Modal, Notify } from 'components/Base'
import CreateModal from 'settings/components/Modals/RackCidrCreate'

export default {
  'rack.create': {
    on({ store, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          if (!data) {
            Modal.close(modal)
            return
          }
          // const isolation =
          //   get(data, 'spec.template.spec.networkIsolation') === 'true'
          // set(data, 'spec.template.spec.networkIsolation', isolation)

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
}
