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

import { get } from 'lodash'
import { getIndexRoute } from 'utils/router.config'

// import Layout from '../../containers/Sai/layout'
import Layout from '../../containers/Sailor/layout'

import RackCidr from '../../containers/Sailor/RackCidr'
import NodeCidr from '../../containers/Sailor/NodeCidr'
import PodCidr from '../../containers/Sailor/PodCidr'

import rackRoutes from './rackCidr'
import nodeRoutes from './nodeCidr'

const PATH = '/clustermgr'

// const navs = globals.app.getInfraNavs()

const navs = globals.app.getSailorNavs()
const indexRoute = get(navs, '[0].items[0].name', 'nodes')

export default [
  ...rackRoutes,
  ...nodeRoutes,
  {
    path: PATH,
    component: Layout,
    routes: [
      {
        path: `${PATH}/rackcidr`,
        component: RackCidr,
        exact: true,
      },
      {
        path: `${PATH}/podcidr`,
        component: PodCidr,
        exact: true
      },
      // {
      //   path: `${PATH}/nodemag`,
      //   component: NodeCidr,
      //   exact: true,
      // },
      getIndexRoute({ path: PATH, to: `${PATH}/${indexRoute}`, exact: true }),
    ],
  },
]
