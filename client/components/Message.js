import moment from 'moment'
import React, { Component } from 'react'
import { MessageType } from '../helper/const'
import PropTypes from 'prop-types'
import { Icon, Button, Tag, Spin } from 'antd'

import styles from '../styles/chat.scss'

const antIcon = <Icon type="loading" style={{fontSize: 24}} spin/>

class Message extends Component {
  static propTypes = {
    type   : PropTypes.string.isRequired,
    from   : PropTypes.string,
    to     : PropTypes.string,
    time   : PropTypes.string,
    message: PropTypes.string,
    loading: PropTypes.bool,
    mine   : PropTypes.bool
  }

  render () {
    let {type, from, to, time, message, mine, loading} = this.props
    if (loading === undefined) {
      loading = false
    }
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
    } else if (type === MessageType.MESSAGE) {
      if (mine) {
        return <div className={styles['message-from']}>
          <div className={styles.avatar}>
            <Button type="link">
              {from}
              <Icon type="user" style={{fontSize: '18px'}}/>
            </Button>
            <div className={styles.time}>{moment(time).format('MM/DD HH:mm')}</div>
          </div>
          <Spin spinning={loading} indicator={antIcon}>
            <div className={styles.message}>
              <div className={styles.arrow}></div>
              <div className={styles['message-inner']} role="tooltip">
                <span>{!!to && (<Tag color="green">@{to}</Tag>)}{message}</span>
              </div>
            </div>
          </Spin>
        </div>
      } else {
        return <div className={styles['message-to']}>
          <div className={styles.avatar}>
            <Button type="link">
              <Icon type="user" style={{fontSize: '18px'}}/>
              {from}
            </Button>
            <div className={styles.time}>{moment(time).format('MM/DD HH:mm')}</div>
          </div>
          <div className={styles.message}>
            <div className={styles.arrow}></div>
            <div className={styles['message-inner']} role="tooltip">
              <span>{!!to && (<Tag color="green">@{to}</Tag>)}{message}</span>
            </div>
          </div>
        </div>
      }
    }

  }
}

export default Message
