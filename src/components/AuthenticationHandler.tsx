'use client'

import { useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useToast } from '@/hooks/use-toast'
import { User } from '@/store/user/user.type'
import { setError, setLoading, setUser } from '@/store/user/user.slice'
import { useAppDispatch } from '@/store'

const AuthenticationHandler = () => {
  const supabase = useSupabaseClient()
  const authUser = useUser()
  const { toast } = useToast()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleUser = async () => {
      if (!authUser) {
        dispatch(setUser(null))
        return
      }

      dispatch(setLoading(true))

      try {
        const { data: existingUser, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw new Error(fetchError.message)
        }

        if (!existingUser) {
          const newUser: Omit<User, 'updated_at'> = {
            id: authUser.id,
            email: authUser.email!,
            full_name: authUser.user_metadata?.full_name || null,
            avatar_url: authUser.user_metadata?.avatar_url || null,
            created_at: new Date().toISOString(),
          }

          const { data: insertedUser, error: insertError } = await supabase
            .from('users')
            .insert([newUser])
            .select('*')
            .single()

          if (insertError) throw new Error(insertError.message)

          dispatch(setUser(insertedUser))
          toast({
            title: '✅ Profile created successfully',
            description: 'Welcome to the platform!',
          })
        } else {
          dispatch(setUser(existingUser))
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'An error occurred'
        dispatch(setError(message))
        toast({
          title: '🔴 Error',
          description: message,
        })
      }
    }

    handleUser()
  }, [authUser, supabase, toast, dispatch])

  return null
}

export default AuthenticationHandler
