import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

let initialState = {}

export function initializeStore (initialState = initialState) {
  const enhancers = [

    composeWithDevTools(applyMiddleware(thunk))
  ]

  const store = createStore(rootReducer, initialState, compose(...enhancers))


  return store
}