const prefix = '@fetch/'
const suffix_request = '/request'
const suffix_success = '/success'
const suffix_failure = '/failure'

let constants = (constant) => {
  return {
    request: prefix + constant + suffix_request,
    success: prefix + constant + suffix_success,
    failure: prefix + constant + suffix_failure
  }
}

let fetch = ({axios, constant, dispatch, success, error}) => {
  let types = constants(constant)
  dispatch({type: types.request})
  return axios.then(({data}) => {
    if (typeof success === 'function') {
      let successData = success(data)
      dispatch({type: types.success, ...successData})
    } else {
      dispatch({type: types.success, data: data})
    }
  }).catch((err) => {
    if (typeof error === 'function') {
      let errorData = error(err)
      dispatch({type: types.failure, ...errorData})
    } else {
      dispatch({type: types.failure, error: err})
    }

  })
}

let reducer = (action, constant) => {
  if (new RegExp(`^@fetch\/${constant}\/.*`, 'ig').test(action.type)) {
    let suffix = action.type.replace(/^@fetch\/.*(\/.*)$/ig, '$1')
    if (suffix === suffix_request) {
      return {loading: true}
    } else if (suffix === suffix_success) {
      const {type, ...others} = action
      return {loading: false, ...others}
    } else if (suffix === suffix_failure) {
      const {type, ...others} = action
      return {loading: false, ...others}
    }
  }
  return null
}


export { fetch, constants, reducer }