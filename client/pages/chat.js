import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'
import Router from 'next/router'
import { MessageType } from '../helper/const'
import { getUsers, createClient } from '../actions/chat'
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

  state = {message: '', toUser: 'all', to: 'all', messageArea : []}

  componentWillMount () {
    if (typeof window !== 'undefined') {
      let {chat, createClient, getUsers} = this.props
      createClient(chat.username)
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  showSystemMessage = (message) => {
    this.setState({messageArea: this.state.messageArea.concat(message)})
  }

  componentWillReceiveProps (nextProps) {
    let {joinRoom, users} = nextProps.chat
    let {getUsers, chat} = this.props
    if (joinRoom && !users.loading && !users.data.length) {
      getUsers()
      //chat.client.on('connect', () => {
      //  console.log('connection opened')
      //})

      chat.client.on('message', (src, payload, payloadType) => {
        let message = JSON.parse(payload)
        if (message.type === MessageType.SYSTEM) { // system message
          this.showSystemMessage(message)
        }
      })
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

  onChange = (e) => {
    const {value} = e.target
    this.setState({message: value})
  }

  handleSend = (e)=>{
    console.log('--------------------')
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
    console.log(this.state.messageArea)
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
                  {!!item.you &&
                  <Button type="link">
                    <Icon type="user" style={{fontSize: '18px'}}/>
                    {item.username}
                  </Button>
                  }
                  {!item.you &&
                  <Button type="link">
                    <Icon type="user" style={{fontSize: '18px'}}/>
                    {item.username}
                  </Button>
                  }


                  {!!item.you &&
                  <Tag className={styles.you} color="green">you</Tag>
                  }
                </List.Item>
              )}
            />
          </div>
          <div className={`${styles['message-area']}`}>
            <div className={styles['message-to']}>
              <div className={styles.avatar}>
                <Button type="link">
                  <Icon type="user" style={{fontSize: '18px'}}/>
                  User1
                </Button>
                <div className={styles.time}>5/4 18:30</div>
              </div>
              <div className={styles.message}>
                <div className={styles.arrow}></div>
                <div className={styles['message-inner']} role="tooltip"><span>Hello! </span></div>
              </div>
            </div>
            <div className={styles['message-to']}>
              <div className={styles.avatar}>
                <Button type="link">
                  <Icon type="user" style={{fontSize: '18px'}}/>
                  User1
                </Button>
                <div className={styles.time}>5/4 18:30</div>
              </div>
              <div className={styles.message}>
                <div className={styles.arrow}></div>
                <div className={styles['message-inner']} role="tooltip"><span>Are you OK?</span></div>
              </div>
            </div>
            <div className={styles['message-from']}>
              <div className={styles.avatar}>
                <Button type="link">
                  sdfsdf
                  <Icon type="user" style={{fontSize: '18px'}}/>
                </Button>
                <div className={styles.time}>5/4 18:30</div>
              </div>
              <div className={styles.message}>
                <div className={styles.arrow}></div>
                <div className={styles['message-inner']} role="tooltip"><span>I'm fine. Thank you. And you?</span></div>
              </div>
            </div>

            {this.state.messageArea && this.state.messageArea.map((item, index)=> (
              <Message key={index} {...item} />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Dropdown.Button overlay={menu} className={styles['to-message']}>
            @{this.state.toUser}
          </Dropdown.Button>

          <div className={styles['message-enter']}>
            <Input autoFocus onChange={this.onChange}/>
            <Button type="primary" disabled={!this.state.message} onClick={this.handleSend}>Send</Button>
          </div>
        </div>

      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  chat : store.chat,
  users: store.chat.users
})
const mapDispatchToProps = (dispatch) => ({
  createClient: (username) => dispatch(createClient(username)),
  getUsers    : () => dispatch(getUsers())
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
