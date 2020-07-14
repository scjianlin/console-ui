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

import { getIndexRoute } from 'utils/router.config'

import ProjectLayout from '../containers/layout'

import Overview from '../containers/Overview'
import Applications from '../containers/Applications'
import Workloads from '../containers/Workloads'
import Pods from '../containers/Pods'
import Jobs from '../containers/Jobs'
import ImageBuilder from '../containers/ImageBuilder'
import CronJobs from '../containers/CronJobs'
import Services from '../containers/Services'
import GrayRelease from '../containers/GrayRelease'
import Routes from '../containers/Routes'
import Volumes from '../containers/Volumes'
import BaseInfo from '../containers/BaseInfo'
import ConfigMaps from '../containers/ConfigMaps'
import Secrets from '../containers/Secrets'
import Roles from '../containers/Roles'
import Members from '../containers/Members'
import AdvancedSettings from '../containers/AdvancedSettings'

import workloadRoutes from './workload'
import serviceRoutes from './service'
import routerRoutes from './router'
import roleRoutes from './role'
import volumeRoutes from './volume'
import applicationRoutes from './application'
import configmapRoutes from './configmap'
import secretRoutes from './secret'
import podRoutes from './pod'
import alertingMessageRoutes from './alerting/message'
import alertingPolicyRoutes from './alerting/policy'
import alertingRoutes from './alerting'
import grayReleaseRoutes from './grayrelease'
import imageBuilderRoutes from './imagebuilder'

const PATH = '/projects/:namespace'

export default [
  ...workloadRoutes,
  ...serviceRoutes,
  ...routerRoutes,
  ...roleRoutes,
  ...volumeRoutes,
  ...applicationRoutes,
  ...configmapRoutes,
  ...secretRoutes,
  ...podRoutes,
  ...alertingMessageRoutes,
  ...alertingPolicyRoutes,
  ...imageBuilderRoutes,
  {
    path: PATH,
    component: ProjectLayout,
    routes: [
      ...alertingRoutes,
      ...grayReleaseRoutes,
      {
        path: `${PATH}/overview`,
        component: Overview,
        exact: true,
      },
      {
        path: `${PATH}/applications`,
        component: Applications,
        exact: true,
      },
      {
        path: `${PATH}/applications/:type`,
        component: Applications,
        exact: true,
      },
      {
        path: `${PATH}/:module(deployments|statefulsets|daemonsets)`,
        component: Workloads,
        exact: true,
      },
      { path: `${PATH}/pods`, component: Pods, exact: true },
      { path: `${PATH}/jobs`, component: Jobs, exact: true },
      {
        path: `${PATH}/s2ibuilders`,
        component: ImageBuilder,
        ksModule: 'devops',
        exact: true,
      },
      { path: `${PATH}/cronjobs`, component: CronJobs, exact: true },
      { path: `${PATH}/services`, component: Services, exact: true },
      {
        path: `${PATH}/grayreleases`,
        component: GrayRelease,
        ksModule: 'servicemesh',
      },
      { path: `${PATH}/routes`, component: Routes, exact: true },
      { path: `${PATH}/volumes`, component: Volumes, exact: true },
      { path: `${PATH}/base-info`, component: BaseInfo, exact: true },
      { path: `${PATH}/configmaps`, component: ConfigMaps, exact: true },
      { path: `${PATH}/secrets`, component: Secrets, exact: true },
      { path: `${PATH}/roles`, component: Roles, exact: true },
      { path: `${PATH}/members`, component: Members, exact: true },
      { path: `${PATH}/advanced`, component: AdvancedSettings, exact: true },
      getIndexRoute({
        path: `${PATH}/workloads`,
        to: `${PATH}/deployments`,
        exact: true,
      }),
      getIndexRoute({ path: PATH, to: `${PATH}/overview`, exact: true }),
      getIndexRoute({ path: '*', to: '/404', exact: true }),
    ],
  },
]
