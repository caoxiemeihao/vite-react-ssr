import React from 'react'
import ReactDOMServer from 'react-dom/server'
import './index.less'
import App from './App'

export function render() {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
