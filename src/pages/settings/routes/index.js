import Layout from '../containers/layout'
import ClusterComm from '../containers/ClusterComm'
import BaseInfo from '../containers/BaseInfo'
import AddCluster from '../containers/AddCluster'

// import detail from './detail'

const PATH = '/settings'

export default [
  // ...detail,
  {
    path: PATH,
    component: Layout,
    routes: [
      { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
      { path: `${PATH}/racckcommon`, component: ClusterComm, exact: true },
      { path: `${PATH}/podcommon`, component: ClusterComm, exact: true },
      { path: `${PATH}/cluster`, component: AddCluster, exact: true },
      { path: `${PATH}/node`, component: ClusterComm, exact: true },
    ],
  },
]
