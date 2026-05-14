import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

function Navbar({ isAdmin, setIsAdmin }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setIsAdmin(false)
    navigate('/')
  }

  return (
    <motion.nav
      className="fixed w-full top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container-xl">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-slate-950 text-sm font-extrabold text-white">
              EH
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-950">EventHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-7 text-sm font-semibold">
            <Link to="/" className="text-slate-600 hover:text-slate-950 transition">
              Home
            </Link>
            <Link to="/events" className="text-slate-600 hover:text-slate-950 transition">
              Events
            </Link>
            <Link to="/bookings" className="text-slate-600 hover:text-slate-950 transition">
              My Bookings
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="text-slate-600 hover:text-slate-950 transition">
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Logout
                </button>
              </>
            )}
            {!isAdmin && (
              <Link
                to="/admin/login"
                className="btn-primary px-4 py-2 text-sm"
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden rounded-md border border-slate-200 p-2 text-slate-900"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {isOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2 text-sm font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Link to="/" className="block text-slate-700 hover:text-slate-950 py-2" onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <Link to="/events" className="block text-slate-700 hover:text-slate-950 py-2" onClick={() => setIsOpen(false)}>
              Events
            </Link>
            <Link to="/bookings" className="block text-slate-700 hover:text-slate-950 py-2" onClick={() => setIsOpen(false)}>
              My Bookings
            </Link>
            {isAdmin && (
              <>
                <Link to="/admin/dashboard" className="block text-slate-700 hover:text-slate-950 py-2" onClick={() => setIsOpen(false)}>
                  Admin
                </Link>
                <button
                  onClick={handleLogout}
                  className="btn-secondary w-full px-4 py-2"
                >
                  Logout
                </button>
              </>
            )}
            {!isAdmin && (
              <Link to="/admin/login" className="btn-primary w-full px-4 py-2" onClick={() => setIsOpen(false)}>
                Admin
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  )
}

export default Navbar
