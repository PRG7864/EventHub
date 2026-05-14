import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/format'

function EventListing({ socket }) {
  const [events, setEvents] = useState([])
  const [search, setSearch] = useState('')
  const [location, setLocation] = useState('')
  const [dateFilter, setDateFilter] = useState('upcoming')
  const [sort, setSort] = useState('date_asc')
  const [loading, setLoading] = useState(false)

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true)
      const res = await getEvents({
        search: search || undefined,
        location: location || undefined,
        date: dateFilter,
        sort
      })
      setEvents(res.data)
    } catch (error) {
      console.error('Failed to fetch events:', error)
    } finally {
      setLoading(false)
    }
  }, [search, location, dateFilter, sort])

  useEffect(() => {
    fetchEvents()
  }, [fetchEvents])

  useEffect(() => {
    if (!socket) return

    const handleSeatUpdate = (data) => {
      setEvents(prevEvents =>
        prevEvents.map(event =>
          event.id === data.event_id ? { ...event, available_seats: data.available_seats } : event
        )
      )
    }

    socket.on('seatUpdate', handleSeatUpdate)
    return () => socket.off('seatUpdate', handleSeatUpdate)
  }, [socket])

  return (
    <div className="page-shell">
      <div className="container-xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <span className="pill">Events</span>
              <h1 className="section-title mt-4">Browse Events</h1>
              <p className="section-copy mt-3 max-w-2xl">
                Search upcoming experiences and book from live seat inventory.
              </p>
            </div>
            <div className="text-sm font-semibold text-slate-500">
              {loading ? 'Refreshing...' : `${events.length} event${events.length === 1 ? '' : 's'} found`}
            </div>
          </div>

          <div className="panel mt-8 grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
            <input
              type="text"
              placeholder="Search events"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="field"
            />

            <select value={location} onChange={(e) => setLocation(e.target.value)} className="field">
              <option value="">All Locations</option>
              <option value="New York">New York</option>
              <option value="Los Angeles">Los Angeles</option>
              <option value="Chicago">Chicago</option>
              <option value="San Francisco">San Francisco</option>
            </select>

            <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="field">
              <option value="upcoming">Upcoming</option>
              <option value="past">Past</option>
              <option value="all">All dates</option>
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)} className="field">
              <option value="date_asc">Date, earliest</option>
              <option value="date_desc">Date, latest</option>
              <option value="price_asc">Price, low to high</option>
              <option value="price_desc">Price, high to low</option>
            </select>
          </div>
        </motion.div>

        {loading ? (
          <div className="py-16 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-slate-950" />
          </div>
        ) : events.length === 0 ? (
          <div className="panel mt-8 p-10 text-center">
            <h2 className="text-xl font-bold text-slate-950">No matching events</h2>
            <p className="mt-2 text-slate-600">Try clearing a filter or searching another city.</p>
          </div>
        ) : (
          <motion.div
            className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
          >
            {events.map((event) => {
              const availability = Math.max(0, Math.min(100, (event.available_seats / event.total_seats) * 100))

              return (
                <motion.article
                  key={event.id}
                  variants={{ hidden: { opacity: 0, y: 18 }, visible: { opacity: 1, y: 0 } }}
                  className="premium-card"
                >
                  <div className="image-fallback relative h-48 overflow-hidden">
                    {event.img && <img src={event.img} alt={event.title} className="h-full w-full object-cover" />}
                    <div className="absolute left-4 top-4 rounded-md bg-white/95 px-3 py-2 text-sm font-bold text-slate-950">
                      {formatDate(event.date, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>{event.location}</span>
                      <span>{formatCurrency(event.price)}</span>
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-950">{event.title}</h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{event.description}</p>

                    <div className="mt-5">
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-semibold text-slate-700">Availability</span>
                        <span className="font-bold text-emerald-700">{event.available_seats}/{event.total_seats}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                        <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${availability}%` }} />
                      </div>
                    </div>

                    <Link to={`/events/${event.id}`} className="btn-primary mt-6 w-full px-4 py-3">
                      Book now
                    </Link>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default EventListing
