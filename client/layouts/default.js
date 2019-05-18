import Link from 'next/link'
import Head from 'next/head'
import Helmet from 'react-helmet'
import { Layout, Menu, Breadcrumb } from 'antd'
//import Header from '../containers/header'
import '../themes/default.less'
import '../styles/index.scss'
export default ({children, title, theme}) => (
  <div className={`theme ${theme ? 'theme-' + theme : ''}`}>
    <Head>
      <meta charSet='utf-8'/>
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
      <meta name="theme-color" content="#ffffff"/>
      <Helmet defaultTitle={title} titleTemplate={`%s`}/>

    </Head>
    {/*<div className={'header-placeholder'}/>*/}
    {/*<Header/>*/}
    <main role="main">
      {children}
    </main>
    {/*<footer style={{textAlign: 'center'}}>
      Ant Design ©2016 Created
    </footer>*/}
  </div>
)