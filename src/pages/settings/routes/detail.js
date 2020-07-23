
import AccountDetail from '../containers/Accounts/Detail'
import RoleDetail from '../containers/Roles/Detail'

const PATH = '/access'

export default [
  {
    path: `${PATH}/accounts/:name`,
    component: AccountDetail,
  },
  {
    path: `${PATH}/roles/:name`,
    component: RoleDetail,
  },
]
