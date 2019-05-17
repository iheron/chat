import App, { Container } from 'next/app'
import React from 'react'
import { CookiesProvider } from 'react-cookie'
import AppComponent from '../containers/app'
import withReduxStore from '../containers/withReduxStore'
import { Provider } from 'react-redux'

class MyApp extends App {
  static async getInitialProps ({Component, router, ctx}) {
    const isServer = !!ctx.req
    if (isServer) {
    }
    let pageProps = {}
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return {pageProps}
  }

  render () {
    const {Component, pageProps, store} = this.props
    return (
      <CookiesProvider>
        <Container>
          <Provider store={store}>
            <AppComponent>
              <Component {...pageProps} />
            </AppComponent>
          </Provider>
        </Container>
      </CookiesProvider>
    )
  }
}

export default withReduxStore(MyApp)