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

import {
  isEmpty,
  isArray,
  isNaN,
  isUndefined,
  isNumber,
  isString,
  get,
  set,
  last,
  flatten,
  min,
  max,
} from 'lodash'
import { getLocalTime } from 'utils'
import { COLORS_MAP, MILLISECOND_IN_TIME_UNIT } from 'utils/constants'
import moment from 'moment-mini'

const UnitTypes = {
  second: {
    conditions: [0.01, 0],
    units: ['s', 'ms'],
  },
  cpu: {
    conditions: [0.1, 0],
    units: ['core', 'm'],
  },
  memory: {
    conditions: [1024 ** 4, 1024 ** 3, 1024 ** 2, 1024, 0],
    units: ['TiB', 'GiB', 'MiB', 'KiB', 'Bytes'],
  },
  disk: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB', 'GB', 'MB', 'KB', 'Bytes'],
  },
  throughput: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s'],
  },
  traffic: {
    conditions: [1000 ** 4, 1000 ** 3, 1000 ** 2, 1000, 0],
    units: ['TB/s', 'GB/s', 'MB/s', 'KB/s', 'B/s'],
  },
  bandwidth: {
    conditions: [1024 ** 2 / 8, 1024 / 8, 0],
    units: ['Mbps', 'Kbps', 'bps'],
  },
}

export const getSuitableUnit = (value, unitType) => {
  const config = UnitTypes[unitType]

  if (isEmpty(config)) return ''

  // value can be an array or a single value
  const values = isArray(value) ? value : [[0, Number(value)]]
  let result = last(config.units)
  config.conditions.some((condition, index) => {
    const triggered = values.some(
      _value =>
        ((isArray(_value) ? get(_value, '[1]') : Number(_value)) || 0) >=
        condition
    )

    if (triggered) {
      result = config.units[index]
    }
    return triggered
  })
  return result
}

export const getSuitableValue = (
  value,
  unitType = 'default',
  defaultValue = 0
) => {
  if ((!isNumber(value) && !isString(value)) || isNaN(Number(value))) {
    return defaultValue
  }

  const unit = getSuitableUnit(value, unitType)
  const unitText = unit ? ` ${t(unit)}` : ''
  const count = getValueByUnit(value, unit || unitType)
  return `${count}${unitText}`
}

export const getValueByUnit = (num, unit) => {
  let value = parseFloat(num)

  switch (unit) {
    default:
      break
    case '':
    case 'default':
      return value
    case 'iops':
      return Math.round(value)
    case '%':
      value *= 100
      break
    case 'm':
      value *= 1000
      if (value < 1) return 0
      break
    case 'KiB':
      value /= 1024
      break
    case 'MiB':
      value /= 1024 ** 2
      break
    case 'GiB':
      value /= 1024 ** 3
      break
    case 'TiB':
      value /= 1024 ** 4
      break
    case 'Bytes':
    case 'B':
    case 'B/s':
      break
    case 'KB':
    case 'KB/s':
      value /= 1000
      break
    case 'MB':
    case 'MB/s':
      value /= 1000 ** 2
      break
    case 'GB':
    case 'GB/s':
      value /= 1000 ** 3
      break
    case 'TB':
    case 'TB/s':
      value /= 1000 ** 4
      break
    case 'bps':
      value *= 8
      break
    case 'Kbps':
      value = (value * 8) / 1024
      break
    case 'Mbps':
      value = (value * 8) / 1024 / 1024
      break
    case 'ms':
      value *= 1000
      break
  }

  return Number(value) === 0 ? 0 : Number(value.toFixed(2))
}

export const getFormatTime = ms =>
  getLocalTime(Number(ms))
    .format('YYYY-MM-DD HH:mm:ss')
    .replace(/:00$/g, '')

export const getChartData = ({
  type,
  unit,
  xKey = 'time',
  legend = [],
  valuesData = [],
  xFormatter,
}) => {
  /*
    build a value map => { 1566289260: {...} }
    e.g. { 1566289260: { 'utilisation': 30.2 } }
  */
  const valueMap = {}
  valuesData.forEach((values, index) => {
    values.forEach(item => {
      const time = parseInt(get(item, [0], 0), 10)
      const value = get(item, [1])
      const key = get(legend, [index])

      if (time && !valueMap[time]) {
        valueMap[time] = legend.reduce((obj, xAxisKey) => {
          if (!obj[xAxisKey]) obj[xAxisKey] = null
          return obj
        }, {})
      }

      if (key && valueMap[time]) {
        valueMap[time][key] =
          value === '-1'
            ? null
            : getValueByUnit(value, isUndefined(unit) ? type : unit)
      }
    })
  })

  const formatter = key => (xKey === 'time' ? getFormatTime(key * 1000) : key)

  // generate the chart data
  const chartData = Object.entries(valueMap).map(([key, value]) => ({
    [xKey]: (xFormatter || formatter)(key),
    ...value,
  }))

  return chartData
}

export const getAreaChartOps = ({
  type,
  title,
  unitType,
  xKey = 'time',
  legend = [],
  data = [],
  xFormatter,
  ...rest
}) => {
  const seriesData = isArray(data) ? data : []
  const valuesData = seriesData.map(result => get(result, 'values') || [])
  const unit = unitType
    ? getSuitableUnit(flatten(valuesData), unitType)
    : rest.unit

  const chartData = getChartData({
    type,
    unit,
    xKey,
    legend,
    valuesData,
    xFormatter,
  })

  const xAxisTickFormatter =
    xKey === 'time' ? getXAxisTickFormatter(chartData) : value => value

  return {
    ...rest,
    title,
    unit,
    xAxisTickFormatter,
    data: chartData,
  }
}

export const getXAxisTickFormatter = (chartValus = []) => {
  const timeList = chartValus.map(({ time }) => +new Date(time))
  const minTime = min(timeList)
  const maxTime = max(timeList)

  if (maxTime - minTime > 8640000) {
    return time => moment(time).format(t('Do HH:mm'))
  }

  return time => moment(time).format('HH:mm:ss')
}

export const getLastMonitoringData = data => {
  const result = {}

  Object.entries(data).forEach(([key, value]) => {
    const values = get(value, 'data.result[0].values', []) || []
    const _value = isEmpty(values)
      ? get(value, 'data.result[0].value', []) || []
      : last(values)
    set(result, `[${key}].value`, _value)
  })

  return result
}

export const getTimesData = data => {
  const result = []

  data.forEach(record => {
    const values = get(record, 'values') || []

    values.forEach(value => {
      const time = get(value, '[0]', 0)
      if (!result.includes(time)) {
        result.push(time)
      }
    })
  })
  return result.sort()
}

export const getZeroValues = () => {
  const values = []
  let time = parseInt(Date.now() / 1000, 10) - 6000
  for (let i = 0; i < 10; i++) {
    values[i] = [time, 0]
    time += 600
  }
  return values
}

export const getColorByName = (colorName = '#fff') =>
  COLORS_MAP[colorName] || colorName

export const startAutoRefresh = (context, options = {}) => {
  const params = {
    method: 'fetchData',
    interval: 5000, // milliseconds
    leading: true,
    ...options,
  }

  if (context && context[params.method]) {
    const fetch = context[params.method]

    if (params.leading) {
      fetch({ autoRefresh: true })
    }

    context.timer = setInterval(() => {
      fetch({ autoRefresh: true })
    }, params.interval)
  }
}

export const stopAutoRefresh = context => {
  if (context && context.timer) {
    clearInterval(context.timer)
    context.timer = null
  }
}

export const isSameDay = (preTime, nextTime) =>
  Math.floor(preTime / 86400000) === Math.floor(nextTime / 86400000)

export const timeAliasReg = /(\d+)(\w+)/

export const timestampify = timeAlias => {
  const [, count = 0, unit] = timeAlias.match(timeAliasReg) || []
  return Number(count) * (MILLISECOND_IN_TIME_UNIT[unit] || 0)
}

export const fillEmptyMetrics = (params, result) => {
  if (!params.times || !params.start || !params.end) {
    return result
  }

  const format = num => String(num).replace(/\..*$/, '')
  const step = Math.floor((params.end - params.start) / params.times)
  const correctCount = params.times + 1

  Object.values(result).forEach(item => {
    const _result = get(item, 'data.result')
    if (!isEmpty(_result)) {
      _result.forEach(resultItem => {
        const curValues = resultItem.values || []
        const curValuesMap = curValues.reduce(
          (prev, cur) => ({
            ...prev,
            [format(cur[0])]: cur[1],
          }),
          {}
        )

        if (curValues.length < correctCount) {
          const newValues = []
          for (let index = 0; index < correctCount; index++) {
            const time = format(params.start + index * step)
            newValues.push([time, curValuesMap[time] || '0'])
          }
          resultItem.values = newValues
        }
      })
    }
  })

  return result
}
