'use server'
import SignOutBtn from './component/SignOutBtn'
import { redirect } from 'next/navigation'
import readUserSession from '@/lib/actions'
const page = async () => {

  const { data } = await readUserSession()
  if (!data.session) {
    redirect('/')
  }
  console.log(data.session)

  return (
    <div>
      <h1>Protected Page</h1>
      <SignOutBtn />

    </div>
  )
}

export default page
