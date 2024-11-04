import { configureStore } from '@reduxjs/toolkit'

import { useDispatch } from 'react-redux'
import rootReducer from '@/store/root.reducer'
import { AppDispatch, RESET_STORE } from '@/store/redux.types'

const index = configureStore({
  reducer: rootReducer,
})

export const resetStore = () => ({ type: RESET_STORE })
export const useAppDispatch = () => useDispatch<AppDispatch>()
export default index
