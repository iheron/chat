import { SWITCH_THEME } from '../actions/theme'

const ThemeReducer = (state = 'light', action) => {
  switch (action.type) {
    case SWITCH_THEME: {
      return action.theme
    }

    default:
      return state
  }
}

export default ThemeReducer
