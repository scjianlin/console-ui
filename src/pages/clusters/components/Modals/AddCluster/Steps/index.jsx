
import React, { Component } from 'react'
import { Icon } from '@pitrix/lego-ui'

import styles from './index.scss'

export default class Steps extends Component {
  render() {
    const { steps, current } = this.props
    return (
      <div className={styles.wrapper}>
        {steps.map((step, index) => (
          <div key={step.title}>
            {current >= index ? (
              <Icon name="success" type="coloured" size={20} />
            ) : (
              <Icon name="dot" type="dark" size={20} />
            )}
            <span style={{color:'black'}}>{t(step.title)}</span>
          </div>
        ))}
      </div>
    )
  }
}
