import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'

import { switchTheme } from '../actions/theme'

import { Input, Icon, PageHeader, Button, Menu, Form } from 'antd'

const MenuItem = Menu.Item

import styles from '../styles/home.scss'
function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}
class Index extends Component {
  static getInitialProps ({store, req}) {
    const isServer = !!req
    if (isServer) {

    }

    return {}
  }


  componentWillMount () {
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  componentWillUnmount () {

  }

  onSwitcherTheme = (event) => {
    let {key, keyPath} = event
    this.props.switchTheme(key)
  }



  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

  render () {
    const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form
    const usernameError = isFieldTouched('username') && getFieldError('username')
    return (
      <DefaultLayout theme={this.props.theme}>
        <Helmet>
          <title>Home</title>
        </Helmet>

        {/*<Menu onClick={this.onSwitcherTheme}>
          <MenuItem key='light'> white </MenuItem>
          <MenuItem key='dark'> black </MenuItem>
        </Menu>*/}
        <PageHeader onBack={() => null} backIcon={false} title="Home" subTitle="Enter your username and join room."/>

        <Form className={styles.body} layout="inline" onSubmit={this.handleSubmit}>
          <Form.Item validateStatus={usernameError ? 'error' : ''} help={usernameError || ''}>
            {getFieldDecorator('username', {
              rules: [{ required: true, message: 'Please input your username!' }],
            })(
              <Input
                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Username"
              />,
            )}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}>
              Join Room
            </Button>
          </Form.Item>
        </Form>
      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  theme: store.theme
})
const mapDispatchToProps = (dispatch) => ({
  switchTheme: (theme) => dispatch(switchTheme(theme))
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create({ name: 'join_room' })(Index))
