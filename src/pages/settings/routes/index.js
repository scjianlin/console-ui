import Layout from '../containers/layout'
import RackCidr from '../containers/RackCidr'
import PodCidr from '../containers/PodCidr'
import BaseInfo from '../containers/BaseInfo'
import Cluster from '../containers/Cluster'
import Node from '../containers/Node'

const PATH = '/settings'

export default [
  {
    path: PATH,
    component: Layout,
    routes: [
      { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
      { path: `${PATH}/racckcommon`, component: RackCidr, exact: true },
      { path: `${PATH}/podcommon`, component: PodCidr, exact: true },
      { path: `${PATH}/cluster`, component: Cluster, exact: true },
      { path: `${PATH}/node`, component: Node, exact: true },
    ],
  },
]
