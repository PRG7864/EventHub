import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import io from 'socket.io-client'

import Landing from './pages/Landing'
import EventListing from './pages/EventListing'
import EventDetails from './pages/EventDetails'
import BookingFlow from './pages/BookingFlow'
import UserBookings from './pages/UserBookings'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'https://eventhub-nxj4.onrender.com'

function App() {
  const [socket, setSocket] = useState(null)
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem('adminToken'))

  useEffect(() => {
    // Initialize Socket.IO connection with proper configuration
    const newSocket = io(SOCKET_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['polling', 'websocket'],
      withCredentials: true
    })

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id)
    })

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    setSocket(newSocket)

    return () => newSocket.close()
  }, [])

  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/events" element={<EventListing socket={socket} />} />
            <Route path="/events/:id" element={<EventDetails socket={socket} />} />
            <Route path="/booking" element={<BookingFlow socket={socket} />} />
            <Route path="/bookings" element={<UserBookings socket={socket} />} />
            <Route path="/admin/login" element={<AdminLogin setIsAdmin={setIsAdmin} />} />
            <Route
              path="/admin/dashboard"
              element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
