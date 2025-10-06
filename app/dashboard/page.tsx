import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Sidebar from '@/components/dashboard/sidebar'

export default async function Dashboard() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/login')
  }

  return (
    <div className="flex">
      {/* <Sidebar /> */}
      <main className=" p-8 mt-[4rem]">
        <p>Hello {data.user.email}</p>
      </main>
    </div>
  )
}
