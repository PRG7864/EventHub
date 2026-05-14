import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEventById } from '../utils/api'
import { formatCurrency, formatDateTime } from '../utils/format'

function EventDetails({ socket }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await getEventById(id)
        setEvent(res.data)
      } catch (error) {
        console.error('Failed to fetch event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  useEffect(() => {
    if (!socket) return

    const handleSeatUpdate = (data) => {
      if (data.event_id === Number(id)) {
        setEvent(prev => prev ? { ...prev, available_seats: data.available_seats } : prev)
      }
    }

    socket.on('seatUpdate', handleSeatUpdate)
    return () => socket.off('seatUpdate', handleSeatUpdate)
  }, [socket, id])

  if (loading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-950" />
      </div>
    )
  }

  if (!event) {
    return (
      <div className="page-shell flex items-center justify-center">
        <p className="text-lg text-slate-600">Event not found</p>
      </div>
    )
  }

  const availability = Math.max(0, Math.min(100, (event.available_seats / event.total_seats) * 100))
  const totalPrice = Number(event.price) * quantity

  return (
    <div className="page-shell">
      <div className="container-xl">
        <motion.div
          className="grid gap-8 lg:grid-cols-[1.35fr_0.65fr]"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="image-fallback h-[420px] overflow-hidden rounded-lg">
              {event.img && <img src={event.img} alt={event.title} className="h-full w-full object-cover" />}
            </div>

            <div className="mt-8">
              <span className="pill">{event.location}</span>
              <h1 className="section-title mt-4">{event.title}</h1>
              <p className="section-copy mt-5">{event.description || 'No description available for this event.'}</p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="panel p-5">
                <p className="text-sm font-semibold text-slate-500">Date & time</p>
                <p className="mt-2 font-bold text-slate-950">{formatDateTime(event.date)}</p>
              </div>
              <div className="panel p-5">
                <p className="text-sm font-semibold text-slate-500">Seats available</p>
                <p className="mt-2 font-bold text-slate-950">{event.available_seats} of {event.total_seats}</p>
              </div>
              <div className="panel p-5">
                <p className="text-sm font-semibold text-slate-500">Ticket price</p>
                <p className="mt-2 font-bold text-slate-950">{formatCurrency(event.price)}</p>
              </div>
            </div>

            <div className="panel mt-6 p-6">
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold text-slate-700">Seat availability</span>
                <span className="font-bold text-emerald-700">{Math.round(availability)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${availability}%` }} />
              </div>
            </div>
          </div>

          <aside className="panel h-fit p-6 lg:sticky lg:top-24">
            <h2 className="text-2xl font-extrabold text-slate-950">Reserve Tickets</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Choose quantity and continue to attendee details.</p>

            <div className="mt-6">
              <label className="label">Number of tickets</label>
              <div className="grid grid-cols-[48px_1fr_48px] overflow-hidden rounded-lg border border-slate-300">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-slate-50 text-xl font-bold hover:bg-slate-100">
                  -
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => {
                    const val = Number.parseInt(e.target.value, 10) || 1
                    setQuantity(Math.min(event.available_seats, Math.max(1, val)))
                  }}
                  className="border-x border-slate-300 py-3 text-center font-bold outline-none"
                />
                <button onClick={() => setQuantity(Math.min(event.available_seats, quantity + 1))} className="bg-slate-50 text-xl font-bold hover:bg-slate-100">
                  +
                </button>
              </div>
              <p className="mt-2 text-sm text-slate-500">Maximum available: {event.available_seats}</p>
            </div>

            <div className="mt-6 rounded-lg bg-slate-50 p-5">
              <div className="flex justify-between text-sm text-slate-600">
                <span>{quantity} x {formatCurrency(event.price)}</span>
                <span className="font-semibold text-slate-950">{formatCurrency(totalPrice)}</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                <span className="font-bold text-slate-950">Total</span>
                <span className="text-2xl font-extrabold text-slate-950">{formatCurrency(totalPrice)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/booking', { state: { event, quantity } })}
              disabled={event.available_seats < quantity || event.available_seats === 0}
              className="btn-primary mt-6 w-full px-4 py-3"
            >
              {event.available_seats === 0 ? 'Sold out' : 'Proceed to booking'}
            </button>

            {event.available_seats < 10 && event.available_seats > 0 && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm font-semibold text-amber-900">
                Only {event.available_seats} seats left.
              </div>
            )}
          </aside>
        </motion.div>
      </div>
    </div>
  )
}

export default EventDetails
