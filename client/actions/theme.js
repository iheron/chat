export const SWITCH_THEME = 'SWITCH_THEME'

export function switchTheme (theme) {
  return (dispatch) => {

    return dispatch({
      type: SWITCH_THEME,
      theme: theme,
    })
  }
}
