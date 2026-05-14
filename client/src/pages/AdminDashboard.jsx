import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventBookings
} from '../utils/api'
import { formatCurrency, formatDateTime } from '../utils/format'

function AdminDashboard() {
  const navigate = useNavigate()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
  const [editingId, setEditingId] = useState(null)
  const [bookings, setBookings] = useState([])
  const [selectedEventId, setSelectedEventId] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login')
    } else {
      fetchEvents()
    }
  }, [navigate])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const res = await getEvents({})
      setEvents(res.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await updateEvent(editingId, data)
      } else {
        await createEvent(data)
      }
      fetchEvents()
      reset()
      setEditingId(null)
    } catch (error) {
      console.error('Failed to save event:', error)
      alert('Failed to save event')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteEvent(id)
        fetchEvents()
      } catch (error) {
        console.error('Failed to delete event:', error)
        alert('Failed to delete event')
      }
    }
  }

  const handleViewBookings = async (eventId) => {
    try {
      const res = await getEventBookings(eventId)
      setBookings(res.data)
      setSelectedEventId(eventId)
      setActiveTab('bookings')
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    }
  }

  const handleEdit = (event) => {
    setEditingId(event.id)
    reset({
      title: event.title,
      description: event.description || '',
      location: event.location,
      date: new Date(event.date).toISOString().slice(0, 16),
      total_seats: event.total_seats,
      price: event.price,
      img: event.img || ''
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    navigate('/')
  }

  return (
    <div className="page-shell">
      <div className="container-xl">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <span className="pill">Operations</span>
            <h1 className="section-title mt-4">Admin Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary px-4 py-2"
          >
            Logout
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 rounded-md px-4 py-2 font-semibold transition ${
              activeTab === 'events'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 rounded-md px-4 py-2 font-semibold transition ${
              activeTab === 'bookings'
                ? 'bg-slate-950 text-white'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Event Form */}
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="panel sticky top-24 p-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingId ? 'Edit Event' : 'Create Event'}
                </h3>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title *</label>
                    <input
                      {...register('title', { required: 'Title is required' })}
                      className="field py-2"
                      placeholder="Event title"
                    />
                    {errors.title && <p className="text-red-600 text-sm">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Description</label>
                    <textarea
                      {...register('description')}
                      className="field py-2"
                      placeholder="Event description"
                      rows="3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Location *</label>
                    <input
                      {...register('location', { required: 'Location is required' })}
                      className="field py-2"
                      placeholder="Location"
                    />
                    {errors.location && <p className="text-red-600 text-sm">{errors.location.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      {...register('date', { required: 'Date is required' })}
                      className="field py-2"
                    />
                    {errors.date && <p className="text-red-600 text-sm">{errors.date.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Total Seats *</label>
                    <input
                      type="number"
                      {...register('total_seats', { required: 'Total seats is required' })}
                      className="field py-2"
                      placeholder="100"
                    />
                    {errors.total_seats && <p className="text-red-600 text-sm">{errors.total_seats.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Price *</label>
                    <input
                      type="number"
                      step="0.01"
                      {...register('price', { required: 'Price is required' })}
                      className="field py-2"
                      placeholder="99.99"
                    />
                    {errors.price && <p className="text-red-600 text-sm">{errors.price.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-1">Image URL</label>
                    <input
                      {...register('img')}
                      className="field py-2"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="btn-primary flex-1 py-2"
                    >
                      {editingId ? 'Update' : 'Create'}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null)
                          reset()
                        }}
                        className="btn-secondary flex-1 py-2"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Events List */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {loading ? (
                <div className="text-center py-12">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <motion.div
                      key={event.id}
                      className="premium-card p-6"
                      whileHover={{ y: -2 }}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.location}</p>
                          <p className="text-sm text-gray-600">
                            {formatDateTime(event.date)}
                          </p>
                          <p className="text-sm text-gray-600 mt-2">
                            {formatCurrency(event.price)} • {event.available_seats}/{event.total_seats} seats
                          </p>
                        </div>

                        <div className="flex gap-2 flex-col">
                          <button
                            onClick={() => handleViewBookings(event.id)}
                            className="btn-secondary px-3 py-1 text-sm"
                          >
                            Bookings
                          </button>
                          <button
                            onClick={() => handleEdit(event)}
                            className="btn-secondary px-3 py-1 text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="rounded-md bg-red-600 px-3 py-1 text-sm font-semibold text-white transition hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {selectedEventId && (
              <div className="mb-4">
                <button
                  onClick={() => setActiveTab('events')}
                  className="font-semibold text-slate-700 hover:text-slate-950"
                >
                  ← Back to Events
                </button>
              </div>
            )}

            {bookings.length === 0 ? (
              <div className="panel p-8 text-center">
                <p className="text-gray-600">No bookings found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full overflow-hidden rounded-lg bg-white">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold">Booking ID</th>
                      <th className="px-4 py-2 text-left font-semibold">Name</th>
                      <th className="px-4 py-2 text-left font-semibold">Email</th>
                      <th className="px-4 py-2 text-left font-semibold">Mobile</th>
                      <th className="px-4 py-2 text-left font-semibold">Tickets</th>
                      <th className="px-4 py-2 text-left font-semibold">Total</th>
                      <th className="px-4 py-2 text-left font-semibold">Status</th>
                      <th className="px-4 py-2 text-left font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking) => (
                      <tr key={booking.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-semibold">#{booking.id}</td>
                        <td className="px-4 py-3">{booking.name}</td>
                        <td className="px-4 py-3">{booking.email}</td>
                        <td className="px-4 py-3">{booking.mobile}</td>
                        <td className="px-4 py-3">{booking.quantity}</td>
                        <td className="px-4 py-3 font-semibold">{formatCurrency(booking.total_amount)}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(booking.booking_date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
