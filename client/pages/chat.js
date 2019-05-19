import map from 'lodash/map'
import moment from 'moment'
import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'
import Router from 'next/router'
import { MessageType } from '../helper/const'
import { getUsers, createClient, send, getLastMessage } from '../actions/chat'
import { Input, Icon, PageHeader, Button, List, Tag, Dropdown, Menu } from 'antd'
import Message from '../components/Message'
import styles from '../styles/chat.scss'

class Chat extends Component {
  static getInitialProps ({store, req, res}) {
    const isServer = !!req
    if (isServer) {
      let {chat} = store.getState()
      if (!chat.username) {
        res.redirect('/')
      }
    }

    return {}
  }

  state = {message: '', toUser: 'all', to: 'all', messageArea: [], lastMessageFlast: false}

  componentWillMount () {
    if (typeof window !== 'undefined') {
      let {chat, createClient, getLastMessage} = this.props
      createClient(chat.username)
      getLastMessage(chat.username, 10)
      this.messageAreaRef = React.createRef()
    }
  }

  componentDidMount () {

  }

  componentUpdateMount () {

  }

  componentWillUnmount () {

  }

  showMessage = (message) => {
    this.setState({messageArea: this.state.messageArea.concat(message)}, () => {
      this.messageAreaRef.current.scrollTop = this.messageAreaRef.current.scrollHeight
    })
  }

  componentWillReceiveProps (nextProps) {
    let {joinRoom, users} = nextProps.chat
    let {lastMessage} = nextProps
    let {getUsers, chat } = this.props
    if (joinRoom && !users.loading && !users.data.length) {
      getUsers()
      //chat.client.on('connect', () => {
      //  console.log('connection opened')
      //})

      chat.client.on('message', (src, payload, payloadType) => {
        console.log('-------------on message----------')
        console.log(payload)
        let message = JSON.parse(payload)
        if (message.type === MessageType.SYSTEM) { // system message
          this.showMessage(message)
          getUsers()
        } else if (message.type === MessageType.MESSAGE) { //  message
          if (message.from === chat.username) {
            //message = {...message, mine:true}
          } else {
            this.showMessage(message)
          }

        }
      })
    }

    if (!lastMessage.loading && !!lastMessage.data && lastMessage.data.length && !this.state.lastMessageFlast) {
      this.setState({lastMessageFlast: true})
      this.showMessage(lastMessage.data)
    }
  }

  handleMenuClick = (e) => {
    let {users} = this.props
    if (e.key === 'all') {
      this.setState({toUser: 'all', to: 'all'})
    } else {
      let user = users.data[e.key]
      if (!!user) {
        this.setState({toUser: user.username, to: user.addr})
      }
    }
  }

  onLeftPadClick = (toUser, toAddr) => {
    return (e) => {
      if (!!toUser) {
        this.setState({toUser: toUser, to: toAddr})
      }
    }
  }

  onChange = (e) => {
    const {value} = e.target
    this.setState({message: value})
  }

  handleSend = (e) => {
    let {send, chat} = this.props
    this.showMessage({
      message: this.state.message,
      type   : MessageType.MESSAGE,
      mine   : true,
      loading: true,
      from   : chat.username,
      to     : 'all' === this.state.toUser ? '' : this.state.toUser,
      time   : moment().format()
    })
    let length = this.state.messageArea.length
    send(chat.username, this.state.toUser, this.state.message, (data) => {
      if (data.code === 0) {
        let messageArea = this.state.messageArea
        messageArea[length].loading = false
        this.setState({messageArea: messageArea})
      }
    })
    this.setState({message: ''})
  }

  render () {
    let {users} = this.props
    const menu = (
      <Menu onClick={this.handleMenuClick}>
        {users.data && users.data.map((item, index) => (
          <Menu.Item key={index}>
            <Icon type="user"/>
            {item.username}
          </Menu.Item>
        ))}
        <Menu.Item key="all">
          @all
        </Menu.Item>
      </Menu>
    )
    return (
      <DefaultLayout theme={this.props.theme}>
        <Helmet>
          <title>Chat</title>
        </Helmet>

        <PageHeader onBack={() => Router.push('/')} title="Chat" subTitle="Click left pad can speak to him."/>

        <div className={styles.body}>
          <div className={styles.pad} style={{width: '200px'}}>
            <List
              itemLayout="horizontal"
              loading={users.loading}
              dataSource={users.data}
              renderItem={item => (
                <List.Item>
                  {item.username === this.props.chat.username &&
                  <Button type="link">
                    <Icon type="user" style={{fontSize: '18px'}}/>
                    {item.username}
                  </Button>
                  }
                  {item.username !== this.props.chat.username &&
                  <Button type="link" onClick={this.onLeftPadClick(item.username, item.addr)}>
                    <Icon type="user" style={{fontSize: '18px'}}/>
                    {item.username}
                  </Button>
                  }

                  {item.username === this.props.chat.username &&
                  <Tag className={styles.you} color="green">you</Tag>
                  }
                </List.Item>
              )}
            />
          </div>
          <div className={`${styles['message-area']}`} ref={this.messageAreaRef}>
            {this.state.messageArea && this.state.messageArea.map((item, index) => (
              <Message key={index} {...item} />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Dropdown.Button overlay={menu} className={styles['to-message']}>
            @{this.state.toUser}
          </Dropdown.Button>

          <div className={styles['message-enter']}>
            <Input autoFocus onChange={this.onChange} value={this.state.message} onPressEnter={this.handleSend}/>
            <Button type="primary" disabled={!this.state.message} onClick={this.handleSend}>Send</Button>
          </div>
        </div>

      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  chat       : store.chat,
  users      : store.chat.users,
  lastMessage: store.chat.lastMessage
})
const mapDispatchToProps = (dispatch) => ({
  createClient  : (username) => dispatch(createClient(username)),
  getUsers      : () => dispatch(getUsers()),
  send          : (fromUser, toUser, message, callback) => dispatch(send(fromUser, toUser, message, callback)),
  getLastMessage: (user, n) => dispatch(getLastMessage(user, n))
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
