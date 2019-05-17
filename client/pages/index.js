import { Component } from 'react'
import { connect } from 'react-redux'
import DefaultLayout from '../layouts/default'
import Helmet from 'react-helmet'

import { switchTheme } from '../actions/theme'

import { Table, Popconfirm, Button, Menu } from 'antd'


const MenuItem = Menu.Item
import '../styles/index.scss'

class Index extends Component {
  static getInitialProps ({store, req}) {
    const isServer = !!req
    if (isServer) {

    }

    return {}
  }


  componentWillMount () {
  }

  componentDidMount () {
    //const {dispatch} = this.props
    //this.timer = startClock(dispatch)
  }

  componentWillUnmount () {

  }

  onSwitcherTheme = (event) => {
    let {key, keyPath} = event
    this.props.switchTheme(key)
  }

  render () {
    //const {intl} = this.props
    return (
      <DefaultLayout theme={this.props.theme}>
        <Helmet>
          <title>Home</title>
        </Helmet>



        <Menu onClick={this.onSwitcherTheme}>
          <MenuItem key='light'> white </MenuItem>
          <MenuItem key='dark'> black </MenuItem>
        </Menu>


      </DefaultLayout>
    )
  }
}

const mapStateToProps = (store) => ({
  theme: store.theme
})
const mapDispatchToProps = (dispatch) => ({
  switchTheme   : (theme) => dispatch(switchTheme(theme))
})
export default connect(mapStateToProps, mapDispatchToProps)( Index)
