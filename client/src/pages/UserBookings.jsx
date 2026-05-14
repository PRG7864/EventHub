import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getUserBookings, cancelBooking } from '../utils/api'
import { formatCurrency, formatDate, formatDateTime } from '../utils/format'

function UserBookings({ socket }) {
  const [searchParams] = useSearchParams()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [lookupEmail, setLookupEmail] = useState('')
  const [activeEmail, setActiveEmail] = useState('')
  const [cancelModal, setCancelModal] = useState(null)
  const [detailsModal, setDetailsModal] = useState(null)

  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setLookupEmail(emailParam)
      fetchBookings(emailParam)
    }
  }, [searchParams])

  const fetchBookings = async (userEmail) => {
    const normalizedEmail = userEmail.trim()
    if (!normalizedEmail) return

    try {
      setLoading(true)
      setActiveEmail(normalizedEmail)
      const res = await getUserBookings(normalizedEmail)
      setBookings(res.data)
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!cancelModal) return

    try {
      await cancelBooking(cancelModal.id)
      setBookings(prev => prev.map(b => b.id === cancelModal.id ? { ...b, status: 'cancelled' } : b))
      setCancelModal(null)
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      alert('Failed to cancel booking')
    }
  }

  if (!activeEmail) {
    return (
      <div className="page-shell">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            className="panel p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold mb-4">My Bookings</h1>
            <p className="text-gray-600 mb-6">Enter your email to view your bookings</p>

            <input
              type="email"
              placeholder="your@email.com"
              value={lookupEmail}
              onChange={(e) => setLookupEmail(e.target.value)}
              className="field mb-4 w-full md:w-96"
            />

            <button
              onClick={() => fetchBookings(lookupEmail)}
              className="btn-primary px-6 py-3"
            >
              View Bookings
            </button>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-shell">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="pill">Tickets</span>
          <h1 className="section-title mb-8 mt-4">My Bookings</h1>

          {loading ? (
            <div className="text-center py-12">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"
              />
            </div>
          ) : bookings.length === 0 ? (
            <div className="panel p-8 text-center">
              <p className="text-gray-600 text-lg mb-4">
                No bookings found for {activeEmail}
              </p>
              <p className="text-gray-500">
                Once you book an event, it will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <motion.div
                  key={booking.id}
                  className="premium-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[1.25fr_1.25fr_0.7fr_1fr_1.35fr]">
                    {/* Event Title */}
                    <div>
                      <p className="text-gray-600 text-sm">Event</p>
                      <p className="font-bold text-lg">{booking.title}</p>
                    </div>

                    {/* Date */}
                    <div>
                      <p className="text-gray-600 text-sm">Date & Time</p>
                      <p className="font-semibold">
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {formatDateTime(booking.date).split(', ').pop()}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div>
                      <p className="text-gray-600 text-sm">Tickets</p>
                      <p className="font-bold text-lg">{booking.quantity}</p>
                    </div>

                    {/* Total */}
                    <div>
                      <p className="text-gray-600 text-sm">Total Amount</p>
                      <p className="font-bold text-lg text-indigo-600">
                        {formatCurrency(booking.total_amount)}
                      </p>
                    </div>

                    {/* Status & Action */}
                    <div>
                      <p className="text-gray-600 text-sm mb-2">Status</p>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-3">
                        <button
                          onClick={() => setDetailsModal(booking)}
                          className="text-sm font-semibold text-slate-900 underline-offset-4 hover:underline"
                        >
                          Show Details
                        </button>

                        {booking.status === 'confirmed' && (
                          <button
                            onClick={() => setCancelModal(booking)}
                            className="text-sm font-semibold text-red-600 underline-offset-4 hover:text-red-800 hover:underline"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelModal && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setCancelModal(null)}
        >
          <motion.div
            className="bg-white rounded-lg p-8 max-w-sm"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-4">Cancel Booking?</h3>
            <p className="text-gray-600 mb-2">
              Event: <strong>{cancelModal.title}</strong>
            </p>
            <p className="text-gray-600 mb-6">
              You will be refunded {formatCurrency(cancelModal.total_amount)}
            </p>

            <div className="flex gap-4">
              <button
                onClick={() => setCancelModal(null)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Confirm Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Booking Details Modal */}
      {detailsModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setDetailsModal(null)}
        >
          <motion.div
            className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-2xl"
            initial={{ scale: 0.92, y: 18 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Booking #{detailsModal.id}
                </p>
                <h3 className="mt-2 text-2xl font-extrabold text-slate-950">
                  {detailsModal.title}
                </h3>
              </div>
              <span
                className={`w-fit px-3 py-1 rounded-full text-sm font-semibold ${
                  detailsModal.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {detailsModal.status.toUpperCase()}
              </span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Attendee</p>
                <p className="mt-1 font-bold text-slate-950">{detailsModal.name}</p>
                <p className="text-sm text-slate-600">{detailsModal.email}</p>
                <p className="text-sm text-slate-600">{detailsModal.mobile}</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Event Schedule</p>
                <p className="mt-1 font-bold text-slate-950">{formatDate(detailsModal.date)}</p>
                <p className="text-sm text-slate-600">{formatDateTime(detailsModal.date).split(', ').pop()}</p>
                <p className="text-sm text-slate-600">{detailsModal.location}</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Booking Date</p>
                <p className="mt-1 font-bold text-slate-950">{formatDate(detailsModal.booking_date)}</p>
                <p className="text-sm text-slate-600">{formatDateTime(detailsModal.booking_date).split(', ').pop()}</p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-500">Payment Summary</p>
                <div className="mt-1 flex justify-between text-sm text-slate-600">
                  <span>Tickets</span>
                  <span className="font-bold text-slate-950">{detailsModal.quantity}</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-slate-200 pt-2">
                  <span className="font-semibold text-slate-700">Total</span>
                  <span className="font-extrabold text-slate-950">
                    {formatCurrency(detailsModal.total_amount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setDetailsModal(null)}
                className="btn-primary px-5 py-3"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default UserBookings
