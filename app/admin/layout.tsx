import { getUser } from '../../lib/supabase-server'
import AdminHeader from './components/AdminHeader'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  
  // Don't show header on login page
  const isLoginPage = false // This will be handled by the page itself
  
  return (
    <div className="min-h-screen bg-gray-50">
      {user && <AdminHeader email={user.email} />}
      {children}
    </div>
  )
}
