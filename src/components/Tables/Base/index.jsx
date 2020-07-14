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

import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import isEqual from 'react-fast-compare'
import { toJS } from 'mobx'
import { find, isUndefined, isEmpty } from 'lodash'
import {
  Icon,
  Table,
  Dropdown,
  Buttons,
  Level,
  LevelItem,
  LevelLeft,
  LevelRight,
  Pagination,
} from '@pitrix/lego-ui'
import { Button, Search } from 'components/Base'
import CustomColumns from './CustomColumns'

import styles from './index.scss'

const ORDER_MAP = {
  ascend: false,
  descend: true,
}

export default class WorkloadTable extends React.Component {
  static propTypes = {
    data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]).isRequired,
    columns: PropTypes.array.isRequired,
    selectedRowKeys: PropTypes.array,
    isLoading: PropTypes.bool,
    pagination: PropTypes.object,
    filters: PropTypes.object,
    keyword: PropTypes.string,
    rowKey: PropTypes.any,
    onFetch: PropTypes.func,
    onSelectRowKeys: PropTypes.func,
    getCheckboxProps: PropTypes.func,
    onDelete: PropTypes.func,
    onCreate: PropTypes.func,
    hideHeader: PropTypes.bool,
    hideFooter: PropTypes.bool,
    hideSearch: PropTypes.bool,
    hideCustom: PropTypes.bool,
    actions: PropTypes.array,
    selectActions: PropTypes.array,
    extraProps: PropTypes.object,
    alwaysUpdate: PropTypes.bool,
    emptyText: PropTypes.oneOfType([PropTypes.string || PropTypes.func]),
  }

  static defaultProps = {
    rowKey: 'name',
    selectedRowKeys: [],
    onFetch() {},
    hideHeader: false,
    hideFooter: false,
    hideSearch: false,
    hideCustom: false,
    extraProps: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      hideColumns: [],
    }

    this.hideableColumns = props.columns
      .filter(column => column.isHideable)
      .map(column => ({
        label: column.title,
        value: column.dataIndex || column.key,
      }))

    this.hideableColumnValues = this.hideableColumns.map(item => item.value)

    this.suggestions = props.columns
      .filter(column => column.search && column.dataIndex)
      .map(column => ({
        label: column.title,
        key: column.dataIndex,
        options:
          column.filters &&
          column.filters.map(filter => ({
            label: filter.text,
            key: filter.value,
          })),
      }))
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.alwaysUpdate) {
      return true
    }

    // new props ?
    if (
      nextProps.data !== this.props.data ||
      nextProps.columns.length !== this.props.columns.length ||
      nextProps.selectedRowKeys.length !== this.props.selectedRowKeys.length ||
      !isEqual(nextProps.filters, this.props.filters) ||
      nextProps.keyword !== this.props.keyword ||
      nextProps.isLoading !== this.props.isLoading ||
      !isEqual(nextProps.pagination, this.props.pagination)
    ) {
      return true
    }

    if (nextState.hideColumns.length !== this.state.hideColumns.length) {
      return true
    }

    return false
  }

  get tags() {
    const { filters } = this.props
    if (typeof filters !== 'object') return []

    return Object.keys(filters).map(n => {
      const curFilter = find(this.suggestions, { key: n }) || {}
      const curValue = curFilter.options
        ? find(curFilter.options, { key: filters[n] }) || {}
        : {}
      return {
        filter: n,
        filterLabel: 'label' in curFilter ? curFilter.label : '',
        value: filters[n],
        valueLabel: 'label' in curValue ? curValue.label : filters[n],
      }
    })
  }

  handleChange = (_, filters, sorter) => {
    this.props.onFetch({
      order: sorter.field || '',
      reverse: ORDER_MAP[sorter.order] || false,
      ...filters,
    })
  }

  handlePagination = page => {
    const { keyword, onPaging, onFetch } = this.props
    const params = { page }

    if (!isEmpty(keyword)) params.keyword = keyword

    if (onPaging) {
      return onPaging(params)
    }

    onFetch(params)
  }

  handleRefresh = () => {
    const { keyword, pagination } = this.props
    const params = {
      limit: pagination.limit,
      page: pagination.page,
    }

    if (!isEmpty(keyword)) params.keyword = keyword

    this.props.onFetch(params)
  }

  handleColumnsHide = columns => {
    this.setState({
      hideColumns: this.hideableColumnValues.filter(
        value => !columns.includes(value)
      ),
    })
  }

  handleCancelSelect = () => {
    this.props.onSelectRowKeys([])
  }

  handleFilterInput = tags => {
    const filters = {}
    tags.forEach(n => {
      filters[n.filter] = n.value
    })

    if (!isEqual(filters, this.props.filters)) {
      this.props.onFetch(filters, true)
    }
  }

  handleSearch = text => {
    this.props.onFetch({ keyword: text }, true)
  }

  clearFilter = () => {
    // you must update the filter in props.onFetch
    const { searchType } = this.props

    if (searchType === 'keyword') {
      this.handleSearch()
    }

    this.handleFilterInput([])
  }

  renderSelectActions() {
    const { onDelete, selectActions } = this.props

    if (selectActions) {
      return (
        <Buttons>
          {selectActions.map(action => (
            <Button
              key={action.key}
              type={action.type}
              className={styles.button}
              onClick={action.onClick}
              data-test={`table-${action.key}`}
            >
              {action.text}
            </Button>
          ))}
        </Buttons>
      )
    }

    return (
      <Buttons>
        {onDelete && (
          <Button
            type="danger"
            className={styles.button}
            onClick={onDelete}
            data-test="table-delete"
          >
            {t('Delete')}
          </Button>
        )}
      </Buttons>
    )
  }

  renderSelectedTitle = () => (
    <Level className={styles.selectTitle}>
      <LevelLeft>{this.renderSelectActions()}</LevelLeft>
      <LevelRight>
        <Button
          type="flat"
          className={styles.cancelSelect}
          onClick={this.handleCancelSelect}
          data-test="table-cancel-select"
        >
          {t('Cancel Select')}
        </Button>
      </LevelRight>
    </Level>
  )

  renderSearch() {
    const { hideSearch, searchType, keyword } = this.props

    if (hideSearch) {
      return null
    }

    if (searchType === 'keyword') {
      const placeholder =
        this.props.placeholder || t('Please input a keyword to find')

      return (
        <Search
          className={styles.keyword}
          value={keyword}
          onSearch={this.handleSearch}
          placeholder={placeholder}
        />
      )
    }

    return (
      <Table.FilterInput
        placeholder={t('Enter query conditions to filter')}
        tags={this.tags}
        suggestions={this.suggestions}
        onChange={this.handleFilterInput}
      />
    )
  }

  renderActions() {
    const { onCreate, actions } = this.props

    if (actions) {
      return actions.map(action => (
        <Button
          key={action.key}
          type={action.type}
          className={styles.create}
          onClick={action.onClick}
          data-test={`table-${action.key}`}
        >
          {action.text}
        </Button>
      ))
    }

    if (!onCreate) {
      return null
    }

    return (
      <Button
        type="control"
        className={styles.create}
        onClick={onCreate}
        data-test="table-create"
      >
        {t('Create')}
      </Button>
    )
  }

  renderNormalTitle() {
    const { hideCustom } = this.props

    return (
      <Level>
        <LevelItem>{this.renderSearch()}</LevelItem>
        <LevelRight>
          <Buttons>
            <Button
              type="flat"
              icon="refresh"
              onClick={this.handleRefresh}
              data-test="table-refresh"
            />
            {!hideCustom && (
              <Dropdown
                content={this.renderColumnsMenu()}
                placement="bottomRight"
              >
                <Button type="flat" icon="cogwheel" data-test="table-columns" />
              </Dropdown>
            )}
            {this.renderActions()}
          </Buttons>
        </LevelRight>
      </Level>
    )
  }

  renderTableTitle = () => {
    if (this.props.selectedRowKeys && this.props.selectedRowKeys.length > 0) {
      return this.renderSelectedTitle()
    }

    return this.renderNormalTitle()
  }

  renderColumnsMenu = () => {
    const { hideColumns } = this.state

    const getHideColumnKeys = cols => {
      const results = []
      this.hideableColumns.forEach(item => {
        if (cols.indexOf(item.value) === -1) {
          results.push(item.value)
        }
      })
      return results
    }

    return (
      <CustomColumns
        className={styles.columnMenu}
        title={t('Custom Columns')}
        options={this.hideableColumns}
        value={getHideColumnKeys(hideColumns)}
        onChange={this.handleColumnsHide}
      />
    )
  }

  renderEmptyText() {
    const { isLoading } = this.props

    if (isLoading) {
      return null
    }

    return (
      this.props.emptyText || (
        <div className={styles.emptyText}>
          <span className={styles.emptyTipIcon}>
            <Icon name="exclamation" size={48} />
          </span>
          <div>{t('No resources matching the filter have been found yet')}</div>
          <p>
            {t('You can try to')}
            <span
              className={styles.action}
              onClick={this.handleRefresh}
              data-test="table-empty-refresh"
            >
              {t('refresh')}
            </span>
            {t('or')}
            <span
              className={styles.action}
              onClick={this.clearFilter}
              data-test="table-empty-clear-filter"
            >
              {t('clear filters')}
            </span>
          </p>
        </div>
      )
    )
  }

  renderTableFooter = () => {
    const { total, page, limit } = this.props.pagination

    return (
      <Level>
        {!isUndefined(total) && (
          <LevelLeft>{t('TOTAL_ITEMS', { num: total })}</LevelLeft>
        )}
        <LevelRight>
          <Pagination
            current={page}
            total={total}
            pageSize={limit}
            onChange={this.handlePagination}
          />
        </LevelRight>
      </Level>
    )
  }

  render() {
    const {
      className,
      data,
      columns,
      isLoading,
      silentLoading,
      rowKey,
      selectedRowKeys,
      onSelectRowKeys,
      hideHeader,
      hideFooter,
      extraProps,
      getCheckboxProps,
    } = this.props
    const { hideColumns } = this.state

    const props = {}

    if (!hideHeader) {
      props.title = this.renderTableTitle
    }

    if (!hideFooter) {
      props.footer = this.props.footer || this.renderTableFooter
    }

    if (onSelectRowKeys) {
      props.rowSelection = {
        selectedRowKeys,
        getCheckboxProps,
        onSelect: (record, checked, selectedRows) => {
          onSelectRowKeys(selectedRows.map(row => row[rowKey]))
        },
        onSelectAll: (checked, selectedRows) => {
          onSelectRowKeys(selectedRows.map(row => row[rowKey]))
        },
      }
    }

    return (
      <Table
        className={classnames(styles.table, 'ks-table', className)}
        rowKey={rowKey}
        columns={columns}
        dataSource={toJS(data)}
        loading={silentLoading ? false : isLoading}
        hiddenColumns={hideColumns}
        onHideColumn={this.handleColumnsHide}
        onChange={this.handleChange}
        emptyText={this.renderEmptyText()}
        {...props}
        {...extraProps}
      />
    )
  }
}
