'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
const SignOutBtn = () => {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [user, setUser] = useState<any>()
  async function GetUser() {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
  }
  GetUser()
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }
  return (
    <div>
      <div>Welcome {user?.email}</div>
      <button onClick={handleSignOut}>log out</button>
    </div>
  )
}

export default SignOutBtn
