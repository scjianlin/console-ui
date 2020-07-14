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

import { action, observable } from 'mobx'

export default class List {
  data = []

  page = 1

  limit = 10

  @observable
  total = 0

  order = ''

  reverse = false

  silent = false

  filters = {}

  @observable
  isLoading = true

  @observable
  selectedRowKeys = []

  @action
  update(params) {
    Object.keys(params).forEach(key => {
      this[key] = params[key]
    })
  }

  reset() {
    this.data = []
    this.page = 1
    this.limit = 10
    this.order = ''
    this.reverse = false
    this.silent = false
    this.filters = {}
    this.isLoading = true
    this.selectedRowKeys = []
  }
}
