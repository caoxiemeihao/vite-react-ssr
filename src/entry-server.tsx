import React from 'react'
import ReactDOMServer from 'react-dom/server'
import App from './App'
import './global.less'

export function render(url: string, context: Record<string, any>) {
  return ReactDOMServer.renderToString(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
