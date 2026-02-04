'use client'

import { useState } from 'react'
import { createBrowserSupabaseClient } from '../../../lib/supabase-browser'
import { useRouter } from 'next/navigation'
import ChangePasswordModal from './ChangePasswordModal'

export default function AdminHeader({ email }: { email?: string }) {
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    const supabase = createBrowserSupabaseClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <>
      <header className="bg-white shadow mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          {/* Mobile layout */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Admin</h1>
              <a href="/" className="text-rose-600 hover:text-rose-700 text-xs">
                ← Back to store
              </a>
            </div>
            
            {/* Desktop nav */}
            <div className="hidden sm:flex items-center gap-4">
              {email && (
                <span className="text-sm text-gray-600">{email}</span>
              )}
              <button
                onClick={() => setShowPasswordModal(true)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="text-sm text-rose-600 hover:text-rose-700"
              >
                Sign out
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="sm:hidden p-2 text-gray-600"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu dropdown */}
          {menuOpen && (
            <div className="sm:hidden mt-3 pt-3 border-t space-y-2">
              {email && (
                <p className="text-sm text-gray-600 py-1">{email}</p>
              )}
              <button
                onClick={() => {
                  setShowPasswordModal(true)
                  setMenuOpen(false)
                }}
                className="block w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1"
              >
                Change Password
              </button>
              <button
                onClick={handleLogout}
                className="block w-full text-left text-sm text-rose-600 hover:text-rose-700 py-1"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </header>

      <ChangePasswordModal 
        isOpen={showPasswordModal} 
        onClose={() => setShowPasswordModal(false)} 
      />
    </>
  )
}
