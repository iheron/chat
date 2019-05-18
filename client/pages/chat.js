import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'
import Router from 'next/router'
import { joinRoom } from '../actions/chat'

import { Input, Icon, PageHeader, Button, List, Tag, Dropdown, Menu, message } from 'antd'

import styles from '../styles/chat.scss'

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
]

const menu = (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key="1">
      <Icon type="user"/>
      1st menu item
    </Menu.Item>
    <Menu.Item key="2">
      <Icon type="user"/>
      2nd menu item
    </Menu.Item>
    <Menu.Item key="3">
      <Icon type="user"/>
      3rd item
    </Menu.Item>
  </Menu>
)

function handleButtonClick (e) {
  message.info('Click on left button.')
  console.log('click left button', e)
}

function handleMenuClick (e) {
  message.info('Click on menu item.')
  console.log('click', e)
}

class Chat extends Component {
  static getInitialProps ({store, req, res}) {
    const isServer = !!req
    if (isServer) {
      let {chat} = store.getState()
      if(!chat.user){
        res.redirect('/')
      }
    }

    return {}
  }

  componentWillMount () {

  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  render () {

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
              dataSource={data}
              renderItem={item => (
                <List.Item>
                  <Button type="link">
                    <Icon type="user" style={{fontSize: '18px'}}/>
                    stetst
                  </Button>
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
            <div className={styles['system-message']}>
              <div className={styles.avatar}>
                <div className={styles.time}>5/4 18:30</div>
              </div>
              <Tag color="red">system</Tag>
              <a type="link">Jay</a>&nbsp;has joined room.
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

          </div>
        </div>

        <div className={styles.footer}>
          <Dropdown.Button onClick={handleButtonClick} overlay={menu} className={styles['to-message']}>
            @all
          </Dropdown.Button>

          <div className={styles['message-enter']}>
            <Input/>
            <Button type="primary">Send</Button>
          </div>
        </div>

      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  chat: store.chat
})
const mapDispatchToProps = (dispatch) => ({
  joinRoom: (username) => dispatch(joinRoom(username))
})
export default connect(mapStateToProps, mapDispatchToProps)(Chat)
