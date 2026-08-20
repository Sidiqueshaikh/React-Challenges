import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.tsx'
import { store } from './store/store'
// TypeScript may not have declarations for CSS imports in this project setup.
// Ignore the next line so the side-effect import doesn't cause a type error.
// @ts-expect-error CSS imports have no type declarations in this setup
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)