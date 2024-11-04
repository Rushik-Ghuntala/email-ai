import { TypedUseSelectorHook, useSelector } from 'react-redux'
import { combineReducers } from 'redux'
import { RESET_STORE, RootReduxState } from './redux.types'

import userSlice from '@/store/user/user.slice'

const appReducer = combineReducers({
  user: userSlice,
})

const rootReducer = (state: any, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined
  }
  return appReducer(state, action)
}

const useStateSelector: TypedUseSelectorHook<RootReduxState> = useSelector
export { useStateSelector }

export default rootReducer
