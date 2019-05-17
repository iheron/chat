import { Component } from 'react'
import { connect } from 'react-redux'

class App extends Component {
  componentWillMount () {

  }

  render () {
    return this.props.children
  }
}

const mapStateToProps = (store) => ({})
const mapDispatchToProps = (dispatch) => ({
  loadAllTokens: () => dispatch(loadAllTokens())
})
export default connect(mapStateToProps, mapDispatchToProps)(App)
