import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { User, UserState } from './user.type'

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.loading = false
    },
    clearUser: (state) => {
      state.user = null
      state.loading = false
      state.error = null
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },
  },
})

export const { setLoading, setUser, setError, clearUser, updateUserProfile } =
  userSlice.actions
export default userSlice.reducer
