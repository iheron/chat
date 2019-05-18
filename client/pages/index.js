import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'
import Router from 'next/router'
import { enterUsername } from '../actions/chat'

import { Input, Icon, PageHeader, Button, Form } from 'antd'

import styles from '../styles/home.scss'

function hasErrors (fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

class Index extends Component {
  static getInitialProps ({store, req}) {
    const isServer = !!req
    if (isServer) {

    }

    return {}
  }

  state = {loading: false}

  componentWillMount () {
  }

  componentDidMount () {
    // To disabled submit button at the beginning.
    this.props.form.validateFields()
  }

  componentWillUnmount () {

  }

  componentWillReceiveProps (nextProps) {

  }

  handleSubmit = e => {
    let {enterUsername} = this.props
    e.preventDefault()
    this.props.form.validateFields((err, values) => {
      if (!err) {
        enterUsername(values.username)
        Router.push('/chat')
      }
    })
  }
  enterLoading = () => {
    this.setState({loading: true})
  }

  render () {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form
    const usernameError = isFieldTouched('username') && getFieldError('username')
    return (
      <DefaultLayout theme={this.props.theme}>
        <Helmet>
          <title>Home</title>
        </Helmet>

        <PageHeader onBack={() => null} backIcon={false} title="Home" subTitle="Enter your username and join room."/>

        <Form className={styles.body} layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
            {getFieldDecorator('username', {
              rules: [{required: true, message: 'Please input your username!'}],
            })(
              <Input autoFocus={true}
                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                placeholder="Username"
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())} loading={this.state.loading}
                    onClick={this.enterLoading}>
              Join Room
            </Button>
          </Form.Item>
        </Form>
      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  chat: store.chat
})
const mapDispatchToProps = (dispatch) => ({
  enterUsername: (username) => dispatch(enterUsername(username))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({name: 'join_room'})(Index))
