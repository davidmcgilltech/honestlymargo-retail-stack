'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '../../../lib/supabase-browser'
import { useRouter } from 'next/navigation'
import ChangePasswordModal from './ChangePasswordModal'

export default function AdminHeader({ email }: { email?: string }) {
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      <header className="bg-white shadow mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <a href="/" className="text-rose-600 hover:text-rose-700 text-sm">
              ← Back to store
            </a>
            <span className="text-gray-400" aria-hidden="true">|</span>
            <h1 className="text-xl font-semibold text-gray-900">Honestly Margo Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            {email && (
              <span className="text-sm text-gray-600">{email}</span>
            )}
            <button
              onClick={() => setShowPasswordModal(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Change Password
            </button>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </>
  )
}
