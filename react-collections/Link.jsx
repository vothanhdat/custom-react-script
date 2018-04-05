import React from 'react'
import { Link } from 'react-router-dom'
import { withTranslate } from './Language';


@withTranslate
export default class LangLink extends React.Component {
  render() {
    const { language: { name: langname } } = this.props
    const { to, language, _, ...rest } = this.props
    const prefix = langname == 'en' ? '' : '/' + langname;

    if (typeof to == 'string') {
      return <Link {...rest} to={(prefix + to).replace('//','/')}/>
    } else {
      return <Link {...rest} to={{
        ...to,
        pathname : (prefix + to.pathname).replace('//','/')
      }}/>
    }
  }
}