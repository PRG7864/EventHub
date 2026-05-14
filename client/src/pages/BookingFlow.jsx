import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import QRCode from 'qrcode.react'
import confetti from 'canvas-confetti'
import { createBooking } from '../utils/api'
import { formatCurrency, formatDateTime } from '../utils/format'

function BookingFlow() {
  const location = useLocation()
  const navigate = useNavigate()
  const { event, quantity } = location.state || {}
  const { register, handleSubmit, formState: { errors }, watch } = useForm()
  const [loading, setLoading] = useState(false)
  const [bookingResult, setBookingResult] = useState(null)
  const email = watch('email')

  if (!event || !quantity) {
    return (
      <div className="pt-20 pb-12 flex items-center justify-center min-h-screen">
        <p className="text-lg text-gray-600">No booking data found</p>
      </div>
    )
  }

  const onSubmit = async (data) => {
    try {
      setLoading(true)
      const res = await createBooking({
        event_id: event.id,
        name: data.name,
        email: data.email,
        mobile: data.mobile,
        quantity
      })

      // Show confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      })

      setBookingResult({
        booking_id: res.data.booking_id,
        total_amount: res.data.total_amount,
        ...data
      })
    } catch (error) {
      console.error('Booking failed:', error)
      alert(error.response?.data?.error || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (bookingResult) {
    return (
      <motion.div
        className="page-shell bg-slate-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            className="panel p-8 text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
          >
            {/* Success Icon */}
            <motion.div
              className="mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl font-extrabold text-emerald-700">
                <span>✓</span>
              </div>
            </motion.div>

            <h2 className="text-3xl font-bold mb-2 text-gray-800">
              Booking Confirmed
            </h2>
            <p className="text-gray-600 mb-8">
              Thank you for your booking. Your tickets are ready!
            </p>

            {/* QR Code */}
            <motion.div
              className="mb-8 inline-block rounded-lg bg-slate-50 p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <QRCode
                value={JSON.stringify({
                  booking_id: bookingResult.booking_id,
                  event: event.title,
                  email: bookingResult.email,
                  quantity
                })}
                size={200}
                level="H"
                includeMargin
              />
            </motion.div>

            {/* Booking Details */}
            <motion.div
              className="mb-8 space-y-4 rounded-lg bg-slate-50 p-6 text-left"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-bold text-indigo-600">#{bookingResult.booking_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Event:</span>
                <span className="font-semibold">{event.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-semibold">{bookingResult.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-semibold">{bookingResult.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tickets:</span>
                <span className="font-semibold">{quantity}</span>
              </div>
              <div className="flex justify-between border-t pt-4">
                <span className="text-gray-600 font-semibold">Total:</span>
                <span className="text-2xl font-bold text-indigo-600">
                  {formatCurrency(bookingResult.total_amount)}
                </span>
              </div>
            </motion.div>

            {/* Actions */}
            <div className="space-y-3">
              <motion.button
                onClick={() => {
                  const qrElement = document.querySelector('canvas')
                  const link = document.createElement('a')
                  link.href = qrElement.toDataURL()
                  link.download = `booking-${bookingResult.booking_id}.png`
                  link.click()
                }}
                className="btn-primary w-full px-6 py-3"
                whileHover={{ scale: 1.02 }}
              >
                Download QR Code
              </motion.button>

              <motion.button
                onClick={() => navigate(`/bookings?email=${bookingResult.email}`)}
                className="btn-secondary w-full px-6 py-3"
                whileHover={{ scale: 1.02 }}
              >
                View My Bookings
              </motion.button>

              <motion.button
                onClick={() => navigate('/')}
                className="w-full px-6 py-3 text-gray-600 hover:text-gray-800 transition"
                whileHover={{ scale: 1.02 }}
              >
                Back to Home
              </motion.button>
            </div>

            {/* Event Details Card */}
            <motion.div
              className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h4 className="font-bold mb-2">Event Details</h4>
              <p className="text-sm text-gray-600 mb-2">
                {formatDateTime(event.date)}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {event.location}
              </p>
              <p className="text-sm text-gray-600">
                A confirmation email has been sent to {bookingResult.email}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="page-shell bg-slate-50">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="panel p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="pill">Checkout</span>
          <h1 className="mt-4 text-3xl font-extrabold text-slate-950">Complete Your Booking</h1>
          <p className="mb-8 mt-2 text-slate-600">{event.title}</p>

          {/* Order Summary */}
          <div className="mb-8 rounded-lg bg-slate-50 p-6">
            <h3 className="font-bold mb-4">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>{quantity} × Ticket(s)</span>
                <span>{formatCurrency(Number(event.price) * quantity)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-slate-950">{formatCurrency(Number(event.price) * quantity)}</span>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="label">Full Name *</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="field"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="label">Email *</label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i,
                    message: 'Invalid email address'
                  }
                })}
                className="field"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </motion.div>

            {/* Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="label">Mobile Number *</label>
              <input
                {...register('mobile', {
                  required: 'Mobile number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Mobile number must be 10 digits'
                  }
                })}
                className="field"
                placeholder="9876543210"
              />
              {errors.mobile && (
                <p className="text-red-600 text-sm mt-1">{errors.mobile.message}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Processing...' : `Complete Booking - ${formatCurrency(Number(event.price) * quantity)}`}
            </motion.button>
          </form>

          {/* Info Box */}
          <div className="mt-8 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              Your QR code appears immediately after booking and can be downloaded.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default BookingFlow
