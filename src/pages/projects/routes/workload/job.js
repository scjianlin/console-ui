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

import { withProps } from 'utils'
import { getChildRoutes } from 'utils/router.config'

import DetailLayout from 'core/layouts/Detail'

import EnvVariables from 'core/containers/Base/Detail/EnvVariables'
import Events from 'core/containers/Base/Detail/Events'
import Detail from '../../containers/Jobs/Detail'
import ExcuteRecords from '../../containers/Jobs/Detail/ExcuteRecords'
import ResourceStatus from '../../containers/Jobs/Detail/ResourceStatus'

import { getPodRoutes } from '../pod'

const MODULE = 'jobs'
const PATH = `/projects/:namespace/${MODULE}/:name`
const ROUTES = [
  { name: 'records', title: 'Excute Records', component: ExcuteRecords },
  {
    name: 'resource-status',
    title: 'Resource Status',
    component: ResourceStatus,
  },
  { name: 'env', title: 'Environment Variables', component: EnvVariables },
  { name: 'events', title: 'Events', component: Events },
]

const BreadCrumbs = [
  {
    label: 'Project',
    url: '/projects/:namespace',
  },
  {
    label: 'Jobs',
    url: `/projects/:namespace/${MODULE}`,
  },
]

export default [
  ...getPodRoutes(PATH, [
    ...BreadCrumbs,
    {
      label: 'Detail',
      url: `/projects/:namespace/${MODULE}/:name`,
    },
  ]),
  {
    path: PATH,
    component: withProps(DetailLayout, {
      module: MODULE,
      component: Detail,
      breadcrumbs: BreadCrumbs,
    }),
    routes: getChildRoutes(ROUTES, PATH),
  },
]
