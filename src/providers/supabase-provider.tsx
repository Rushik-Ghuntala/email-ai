// src/providers/supabase-provider.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect } from 'react'
import type { Database } from '@/types/database.types'

const AuthContext = createContext<{
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}>({
  signInWithGoogle: async () => {},
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createClientComponentClient<Database>()
  const router = useRouter()

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/gmail.send',
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return (
    <AuthContext.Provider value={{ signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
