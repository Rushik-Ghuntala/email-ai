// src/hooks/useAuth.ts
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    // Get the initial session
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    fetchUser()

    // Set up a listener for authentication state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, signInWithGoogle, signOut }
}
