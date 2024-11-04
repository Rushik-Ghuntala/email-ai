export interface UserState {
  user: User | null
  loading: boolean
  error: string | null
}

export interface User {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
