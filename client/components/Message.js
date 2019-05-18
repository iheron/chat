import moment from 'moment'
import React, { Component } from 'react'
import { MessageType } from '../helper/const'
import PropTypes from 'prop-types'
import { Input, Icon, PageHeader, Button, List, Tag, Dropdown, Menu, message } from 'antd'

import styles from '../styles/chat.scss'
class Message extends Component {
  static propTypes = {
    type   : PropTypes.string.isRequired,
    from   : PropTypes.string,
    to     : PropTypes.string,
    time   : PropTypes.string,
    message: PropTypes.string
  }

  render () {
    let {type, from, to, time, message} = this.props
    if (type === MessageType.SYSTEM) {
      return <div className={styles['system-message']}>
        <div className={styles.avatar}>
          <div className={styles.time}>{moment(time).format('MM/DD HH:mm')}</div>
        </div>
        <div className={styles.container}>
          <Tag color="red">system</Tag>
          {message}
        </div>
      </div>
    }

  }
}

export default Message
