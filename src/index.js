import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import 'core-js'
import 'react-toastify/dist/ReactToastify.css'
import App from './App'
// import store from './redux/store'
import { PersistGate } from "redux-persist/integration/react";
import { persistor, store } from "./redux/store";
createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
)
