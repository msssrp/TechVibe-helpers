## How to Setup supabase Oauth and exchange Session from any providers

To get the session from supabase we need to login first for example we will use Google auth for this

- setup supabase server in nextjs

[`src/lib/supabase/server.ts`]
```bash
'use server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'

import { cookies } from 'next/headers'

export default async function createSupabaseServerClient() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: "", ...options })
        }
      }
    }
  )
}
```

This server code will initailize the supabase Server Side Client for use on the supabase api in any Server side component

- setup action for use on any page then we want to check if use has session or not on the Server side

[`src/lib/actions/index.ts`]
```bash
'use server'

import createSupabaseServerClient from "../supabase/server"

export default async function readUserSession() {
  const supabase = await createSupabaseServerClient()
  return supabase.auth.getSession()
}
```

- then we need to create route for accept the code exchange from google and store it in cookie

[`src/app/auth/callback/route.ts`]
```bash
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { type CookieOptions, createServerClient } from '@supabase/ssr'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  # if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/protected'

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  # return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
```
this route will exchange the code from google callback and use it for get the session from supabase

- login page code

[`src/app/page.tsx`]
```bash
'use client'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
export default function Home() {

  const supabase = createClientComponentClient()


  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000/auth/callback'
      }
    })
  }
```
if the component is the client side we have to use createClientComponentClient for it.
The handleGoogle function will send the post request to supabase with the signInWithOauth function and you need to give in an options and providers.
The options [`redirectTo`] will redirect to exchange code from google to get the session from supabase

- protected route

[`src/app/protected/page.tsx`]
```bash
'use server'
import SignOutBtn from './component/SignOutBtn'
import { redirect } from 'next/navigation'
import readUserSession from '@/lib/actions'
const page = async () => {

  const { data } = await readUserSession()
  if (!data.session) {
    redirect('/')
  }
```
then we can use the actions readUserSession for get the useSession from supabase.
