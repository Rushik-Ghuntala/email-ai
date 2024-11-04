import { Action, ThunkAction } from '@reduxjs/toolkit'
import index from '@/store/index'
import { UserState } from './user/user.type'

export interface RootReduxState {
  user: UserState
}

export type RootState = ReturnType<typeof index.getState>

export type AppDispatch = typeof index.dispatch

export type AppThunk<T = Promise<void> | void> = ThunkAction<
  T,
  RootReduxState,
  unknown,
  Action<string>
>

export const RESET_STORE = 'RESET_STORE'
