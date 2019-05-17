import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'redux-devtools-extension'

let initialState = {}

export function initializeStore (initialState = initialState) {
  const enhancers = [
    applyMiddleware(thunk),
    composeWithDevTools(applyMiddleware(thunk))
  ]

  const store = createStore(rootReducer, initialState, compose(...enhancers))

  return store
}