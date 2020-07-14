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

const deleteUnenableAttrs = data => {
  for (const key in data) {
    if (key.startsWith('enable_') && data[key] === false) {
      delete data[key.slice(7)]
      data.git_source && delete data.git_source[key.slice(7)]
      data.github_source && delete data.github_source[key.slice(7)]
      data.bitbucket_server_source &&
        delete data.bitbucket_server_source[key.slice(7)]
      data.svn_source && delete data.svn_source[key.slice(7)]
    }
  }
}

export const updatePipelineParams = data => {
  const { multi_branch_pipeline, pipeline, type, ...rest } = data
  if (multi_branch_pipeline) {
    rest && Object.assign(data.multi_branch_pipeline, rest)
    data.type = 'multi-branch-pipeline'
    deleteUnenableAttrs(data.multi_branch_pipeline)
  } else {
    if (data.pipeline) {
      Object.assign(data.pipeline, rest)
    } else {
      data.pipeline = rest
    }
    data.type = 'pipeline'
    deleteUnenableAttrs(data.pipeline)
  }
  for (const key in rest) {
    if (key !== 'project_id') {
      delete data[key]
    }
  }
}

export const groovyToJS = str => {
  const groovyReg = /([\w-]*) ?: '?([\w-:/_.]*)'?/g
  const result = {}
  let arr
  // eslint-disable-next-line no-cond-assign
  while ((arr = groovyReg.exec(str)) !== null) {
    if (arr[1]) {
      result[arr[1]] = arr[2]
    }
  }

  return result
}

export const getLanguageIcon = (name, defaultIcon) => {
  const LEGO_LANGUAGE_ICON = [
    'java',
    'gradle',
    'javascript',
    'php',
    'python',
    'golang',
    'nodejs',
    'jar',
    'war',
    'binary',
  ]
  return LEGO_LANGUAGE_ICON.includes(name) ? name : defaultIcon
}
