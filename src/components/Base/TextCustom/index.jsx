
import React from 'react'
import { Icon } from '@pitrix/lego-ui'
import { isUndefined } from 'lodash'
import classNames from 'classnames'

import styles from './index.scss'

export default class TextCustom extends React.PureComponent {
  render() {
    const {
      icon,
      title,
      description,
      className,
      ellipsis,
      extra,
      onClick,
      status,
    } = this.props

    return (
      <div
        className={classNames(
          styles.wrapper,
          { [styles.clickable]: !!onClick, [styles.ellipsis]: ellipsis },
          className
        )}
        onClick={onClick}
      >
        {icon && <Icon className={styles.icon} name={icon} size={40} />}
        { status === 'success' && (
        <div className={styles.success}>
          <div>{isUndefined(title) || title === '' ? '-' : title}</div>
          <p>{description}</p>
        </div>)}
        { status === 'init' && (
        <div className={styles.init}>
          <div>{isUndefined(title) || title === '' ? '-' : title}</div>
          <p>{description}</p>
        </div>)}
        { status === 'failed' && (
        <div className={styles.failed}>
          <div>{isUndefined(title) || title === '' ? '-' : title}</div>
          <p>{description}</p>
        </div>)}
        {extra}
      </div>
    )
  }
}
