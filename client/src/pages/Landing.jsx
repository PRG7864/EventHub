import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getEvents } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/format'

const FUCHSIA = '#D8125B'
const DARK = '#2C2E39'
const LIGHT_BG = '#694382'
const heroImage = 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1800&q=85'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.23, 1, 0.320, 1] }
  }
}

const speakers = [
  ['Maya Singh', 'Experience Curator', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80'],
  ['Daniel Kim', 'Venue Operations', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80'],
  ['Elena Torres', 'Events Producer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80'],
  ['Arjun Mehta', 'Ticketing Strategy', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80']
]

const eventTypes = ['Concerts', 'Conferences', 'Comedy', 'Festivals', 'Exhibitions', 'Championships']

const schedule = [
  ['09:00 - 10:00 am', 'Opening Keynote', 'Start with creators, organizers, and a preview of the live experiences ahead.'],
  ['10:30 - 11:50 am', 'Live Showcase', 'Explore music, tech, food, comedy, and sports formats built for packed rooms.'],
  ['01:20 - 02:30 pm', 'VIP Networking', 'Meet attendees, partners, and venues in an exclusive lounge setting.'],
  ['03:00 - 04:30 pm', 'Ticketing Lab', 'See how real-time inventory, QR tickets, and cancellations stay in sync.']
]

const faqs = [
  ['Can I cancel my booking?', 'Yes. Confirmed bookings can be cancelled from the My Bookings page with full refund within 48 hours.'],
  ['Will I receive a QR code?', 'Yes. Every successful booking generates a premium QR code confirmation via email and SMS.'],
  ['Are seats updated live?', 'Yes. Premium live seat inventory updates across all connected screens in real-time.'],
  ['Is there VIP access?', 'Yes. Premium tier includes priority seating, early access, and exclusive experiences.']
]

const features = [
  { icon: '✨', label: 'Premium Experience', desc: 'Curated events handpicked for quality' },
  { icon: '⚡', label: 'Instant Booking', desc: 'Real-time seat selection & confirmation' },
  { icon: '🔐', label: 'Secure Payment', desc: 'Bank-level encryption for all transactions' },
  { icon: '🎟️', label: 'Smart Tickets', desc: 'Digital QR + Mobile pass integration' }
]

function Landing() {
  const [featured, setFeatured] = useState([])
  const primaryEvent = featured[0]

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getEvents({ date: 'upcoming', sort: 'date_asc' })
        setFeatured(res.data.slice(0, 3))
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }
    fetchEvents()
  }, [])

  const countdown = useMemo(() => {
    if (!primaryEvent) {
      return [
        ['15', 'Days'],
        ['08', 'Hours'],
        ['30', 'Minutes'],
        ['52', 'Seconds']
      ]
    }

    const ms = Math.max(0, new Date(primaryEvent.date).getTime() - Date.now())
    return [
      [String(Math.floor(ms / 86400000)).padStart(2, '0'), 'Days'],
      [String(Math.floor((ms % 86400000) / 3600000)).padStart(2, '0'), 'Hours'],
      [String(Math.floor((ms % 3600000) / 60000)).padStart(2, '0'), 'Minutes'],
      [String(Math.floor((ms % 60000) / 1000)).padStart(2, '0'), 'Seconds']
    ]
  }, [primaryEvent])

  return (
    <div className="bg-[#F8F6F3] text-[#2C2E39] landing-page">
      {/* Premium Hero Section */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2C2E39] via-[#2C2E39] to-[#3A3D4A] pt-24 text-white">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-[#D8125B]/40 to-transparent blur-3xl"
          animate={{ scale: [1, 1.2, 1], x: [0, 40, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-gradient-to-tl from-[#D8125B]/30 to-transparent blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />

        {/* Top Navigation Bar */}
        <div className="absolute inset-x-0 top-0 border-b border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-md">
          <div className="container-xl flex items-center justify-between py-4">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-black tracking-tighter">
              EVENT<span className="text-[#D8125B]">HUB</span>
            </motion.div>
            <div className="hidden items-center gap-8 md:flex text-sm font-semibold text-white/70">
              <span>Premium Events • Live Tickets • QR Confirmation</span>
            </div>
            <Link to="/events" className="rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-6 py-2.5 font-bold text-white shadow-lg shadow-[#D8125B]/30 transition hover:shadow-xl hover:shadow-[#D8125B]/50 hover:-translate-y-0.5">
              Book Now
            </Link>
          </div>
        </div>

        {/* Hero Content */}
        <div className="container-xl relative grid min-h-screen items-center gap-16 py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-block rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-4 py-2 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#D8125B]/20">
                ✨ Premium Ticketing Experience
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight"
            >
              Your Next
              <span className="block bg-gradient-to-r from-[#D8125B] to-[#E6246E] bg-clip-text text-transparent">
                Premium Night
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl max-w-xl leading-relaxed text-white/80">
              Experience the future of event booking. Real-time seat selection, premium QR tickets, and seamless payment—all in one curated platform.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/events" className="group relative px-8 py-4 rounded-full font-bold text-white overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D8125B] to-[#E6246E] rounded-full transition group-hover:shadow-2xl group-hover:shadow-[#D8125B]/50 group-hover:scale-105" />
                <span className="relative flex items-center justify-center gap-2">
                  Explore Events
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Link>
              <Link to="/bookings" className="group px-8 py-4 rounded-full font-bold border-2 border-white/30 text-white hover:border-[#D8125B] hover:bg-[#D8125B]/10 transition">
                My Bookings
              </Link>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 pt-8 max-w-lg">
              {[['500+', 'Events'], ['50K+', 'Attendees'], ['99.9%', 'Uptime']].map(([value, label]) => (
                <div key={label} className="group rounded-xl bg-white/10 backdrop-blur border border-white/20 p-4 hover:bg-white/15 hover:border-[#D8125B]/50 transition">
                  <p className="text-3xl font-black text-[#D8125B]">{value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider text-white/60 mt-2">{label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Premium Featured Event Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.320, 1] }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#D8125B]/20 to-transparent rounded-3xl blur-2xl" />
            <Link to={primaryEvent ? `/events/${primaryEvent.id}` : '/events'} className="group block relative">
              <motion.div
                className="relative overflow-hidden rounded-3xl border border-white/20 shadow-2xl"
                whileHover={{ y: -8 }}
              >
                <img
                  src={heroImage}
                  alt="Featured event"
                  className="w-full h-96 md:h-[500px] object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2C2E39]/90 via-[#2C2E39]/40 to-transparent" />

                {/* Premium Badge */}
                <motion.div
                  className="absolute top-6 right-6 bg-white/95 backdrop-blur rounded-full px-4 py-2 shadow-xl"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                >
                  <span className="text-sm font-black text-[#D8125B]">FEATURED</span>
                </motion.div>

                {/* Event Info Card */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="bg-white/95 backdrop-blur rounded-2xl p-6 space-y-3">
                    <span className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-3 py-1">
                      Premium Event
                    </span>
                    <h2 className="text-2xl font-black text-[#2C2E39]">{primaryEvent?.title || 'Exclusive Experience'}</h2>
                    <div className="flex items-center gap-4 text-sm font-bold text-[#2C2E39]/70">
                      <span>📅 {primaryEvent ? formatDate(primaryEvent.date) : 'Coming Soon'}</span>
                      <span>📍 {primaryEvent?.location || 'Prime Venue'}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        </div>

        {/* Marquee Section */}
        <div className="border-y border-white/10 bg-gradient-to-r from-[#D8125B] to-[#E6246E] py-5 overflow-hidden">
          <motion.div
            className="flex gap-12 whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, duration: 20, ease: 'linear' }}
          >
            {[...eventTypes, ...eventTypes].map((item, index) => (
              <span key={index} className="text-lg font-black uppercase tracking-wide text-white">
                ★ {item}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 bg-[#F8F6F3]">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
              Why Choose EventHub
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-6">
              Premium Features
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-[#2C2E39]/70 max-w-2xl mx-auto">
              Everything you need for the ultimate event booking experience
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group rounded-2xl border border-[#2C2E39]/10 bg-white p-8 shadow-sm hover:shadow-xl hover:border-[#D8125B]/50 transition"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-black text-[#2C2E39] mb-3">{feature.label}</h3>
                <p className="text-[#2C2E39]/70">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Team Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8F6F3] to-white">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
              Meet the Experts
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black">
              Curated by Legends
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {speakers.map(([name, role, image], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl overflow-hidden border border-[#2C2E39]/10 bg-white shadow-lg hover:shadow-2xl transition"
              >
                <div className="h-64 overflow-hidden bg-gradient-to-br from-[#D8125B]/20 to-[#2C2E39]/20">
                  <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-black text-[#2C2E39]">{name}</h3>
                  <p className="text-sm font-bold text-[#D8125B] mt-2">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-white">
        <div className="container-xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
                About EventHub
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-6">
                Your Premium Ticketing Partner
              </motion.h2>
              <motion.p variants={itemVariants} className="text-xl text-[#2C2E39]/70 leading-relaxed">
                We've reimagined event booking with real-time seat tracking, secure payments, and instant QR ticket generation. Join thousands of satisfied attendees.
              </motion.p>
              <motion.div variants={itemVariants} className="mt-10 flex flex-col gap-4">
                {['Real-time seat inventory', 'Premium QR confirmation', '24/7 customer support'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] text-white text-sm font-bold">✓</span>
                    <span className="font-bold text-[#2C2E39]">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#D8125B]/20 to-[#2C2E39]/10 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-[#2C2E39]/10 bg-gradient-to-br from-white to-[#F8F6F3] p-12 shadow-xl">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    ['500K+', 'Bookings'],
                    ['150+', 'Cities'],
                    ['99.9%', 'Uptime'],
                    ['24/7', 'Support']
                  ].map(([value, label]) => (
                    <div key={label} className="text-center">
                      <p className="text-4xl font-black bg-gradient-to-r from-[#D8125B] to-[#E6246E] bg-clip-text text-transparent">{value}</p>
                      <p className="text-sm font-bold uppercase tracking-wide text-[#2C2E39]/60 mt-2">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Events Section */}
      <section className="py-24 bg-gradient-to-b from-white via-[#F8F6F3] to-white">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
              Featured Collection
            </motion.span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black">
                Curated Events
              </motion.h2>
              <Link to="/events" className="group w-fit rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-8 py-4 font-bold text-white shadow-lg shadow-[#D8125B]/30 hover:shadow-xl hover:shadow-[#D8125B]/50 transition hover:-translate-y-1">
                View All Events →
              </Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className="group overflow-hidden rounded-2xl border border-[#2C2E39]/10 bg-white shadow-lg hover:shadow-2xl hover:border-[#D8125B]/50 transition"
              >
                <Link to={`/events/${event.id}`} className="block">
                  <div className="relative h-72 overflow-hidden bg-gradient-to-br from-[#D8125B]/20 to-[#2C2E39]/20">
                    {event.img && <img src={event.img} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-full px-4 py-2">
                      <span className="text-sm font-black text-[#D8125B]">{event.available_seats} Seats</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <span className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-3 py-1 mb-3">
                          {formatDate(event.date)}
                        </span>
                        <h3 className="text-2xl font-black text-[#2C2E39] line-clamp-2">{event.title}</h3>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-[#2C2E39]/70 leading-relaxed">{event.description}</p>
                    <div className="mt-6 flex items-center justify-between pt-6 border-t border-[#2C2E39]/10">
                      <span className="text-2xl font-black bg-gradient-to-r from-[#D8125B] to-[#E6246E] bg-clip-text text-transparent">
                        {formatCurrency(event.price)}
                      </span>
                      <span className="text-sm font-bold text-[#2C2E39]/60">📍 {event.location}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-6 pb-6">
                  <Link to={`/events/${event.id}`} className="flex items-center justify-center gap-2 w-full rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-6 py-3 font-bold text-white shadow-lg shadow-[#D8125B]/30 hover:shadow-xl transition group-hover:scale-105">
                    Book Now →
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Schedule Section */}
      <section className="py-24 bg-white">
        <div className="container-xl">
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
            >
              <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
                Event Schedule
              </motion.span>
              <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-8">
                Plan Your Day
              </motion.h2>
              <Link to="/events" className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-8 py-4 font-bold text-white shadow-lg shadow-[#D8125B]/30 hover:shadow-xl transition hover:-translate-y-1">
                Explore Schedule
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={containerVariants}
              className="space-y-4"
            >
              {schedule.map(([time, title, copy], index) => (
                <motion.a
                  key={title}
                  href={featured[index % Math.max(featured.length, 1)] ? `/events/${featured[index % featured.length].id}` : '/events'}
                  variants={itemVariants}
                  className="group block p-6 rounded-2xl border border-[#2C2E39]/10 bg-gradient-to-r from-white to-[#F8F6F3] hover:from-[#D8125B] hover:to-[#E6246E] hover:text-white transition shadow-sm hover:shadow-lg"
                  whileHover={{ x: 8 }}
                >
                  <div className="flex items-start gap-4 md:gap-6">
                    <div className="flex-shrink-0">
                      <span className="text-xs font-black uppercase tracking-widest text-[#D8125B] group-hover:text-white/80 bg-[#D8125B]/10 group-hover:bg-white/20 rounded-full px-3 py-1">
                        {time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-[#2C2E39] group-hover:text-white">{title}</h3>
                      <p className="mt-2 leading-relaxed text-[#2C2E39]/70 group-hover:text-white/80">{copy}</p>
                    </div>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Premium Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-[#F8F6F3] to-white">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="text-center mb-16"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
              Premium Membership
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-6">
              Choose Your Plan
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-[#2C2E39]/70 max-w-2xl mx-auto">
              Flexible pricing to suit your event needs
            </motion.p>
          </motion.div>

          <div className="grid max-w-4xl mx-auto gap-8 md:grid-cols-2">
            {[
              {
                name: 'Standard',
                price: '$39',
                desc: 'Perfect for casual event-goers',
                features: ['Event discovery', 'Standard seating', 'QR ticket confirmation', 'Booking management']
              },
              {
                name: 'Premium',
                price: '$149',
                desc: 'For premium event enthusiasts',
                features: ['All Standard features', 'Priority seating', 'VIP early access', '24/7 concierge support', 'Exclusive events']
              }
            ].map(({ name, price, desc, features }, index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -12 }}
                className={`relative rounded-2xl border transition overflow-hidden ${
                  index === 1
                    ? 'border-[#D8125B] bg-gradient-to-br from-[#2C2E39] to-[#1A1C24] text-white shadow-2xl shadow-[#D8125B]/30'
                    : 'border-[#2C2E39]/10 bg-white shadow-lg hover:shadow-xl hover:border-[#D8125B]/50'
                }`}
              >
                {index === 1 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-4 py-1 text-xs font-black uppercase tracking-widest text-white rounded-bl-xl">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-black">{name}</h3>
                  <p className={`mt-2 text-sm ${index === 1 ? 'text-white/70' : 'text-[#2C2E39]/70'}`}>{desc}</p>
                  <div className="mt-6 mb-8">
                    <span className={`text-5xl font-black ${index === 1 ? 'text-[#D8125B]' : 'text-[#D8125B]'}`}>{price}</span>
                    <span className={index === 1 ? 'text-white/60' : 'text-[#2C2E39]/60'}>/month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] flex items-center justify-center text-white text-xs font-bold">✓</span>
                        <span className={`text-sm font-semibold ${index === 1 ? 'text-white/80' : 'text-[#2C2E39]/80'}`}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/events"
                    className={`flex items-center justify-center gap-2 w-full py-4 font-bold rounded-full transition shadow-lg transition ${
                      index === 1
                        ? 'bg-gradient-to-r from-[#D8125B] to-[#E6246E] text-white hover:shadow-xl hover:shadow-[#D8125B]/50 hover:-translate-y-1'
                        : 'bg-[#2C2E39] text-white hover:bg-gradient-to-r hover:from-[#D8125B] hover:to-[#E6246E] hover:shadow-lg hover:shadow-[#D8125B]/30'
                    }`}
                  >
                    Get Started
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium FAQ Section */}
      <section className="py-24 bg-white">
        <div className="container-xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="mb-16"
          >
            <motion.span variants={itemVariants} className="inline-block text-xs font-black uppercase tracking-widest text-[#D8125B] bg-[#D8125B]/10 rounded-full px-4 py-2 mb-6">
              Questions & Answers
            </motion.span>
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black">
              Frequently Asked
            </motion.h2>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map(([question, answer], index) => (
              <motion.details
                key={question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="group rounded-2xl border border-[#2C2E39]/10 bg-gradient-to-r from-white to-[#F8F6F3] p-6 shadow-sm hover:shadow-lg hover:border-[#D8125B]/50 transition cursor-pointer"
              >
                <summary className="list-none text-lg font-black text-[#2C2E39] flex items-center justify-between">
                  {question}
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#D8125B]/20 group-open:bg-[#D8125B]/30 transition text-[#D8125B]">
                    <svg className="w-4 h-4 transform group-open:rotate-180 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </span>
                </summary>
                <p className="mt-4 leading-relaxed text-[#2C2E39]/70">{answer}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#2C2E39] via-[#3A3D4A] to-[#2C2E39] relative overflow-hidden">
        <motion.div
          className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-[#D8125B]/20 blur-3xl"
          animate={{ scale: [1, 1.1, 1], x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -right-40 -bottom-40 h-80 w-80 rounded-full bg-[#D8125B]/15 blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], y: [0, -40, 0] }}
          transition={{ repeat: Infinity, duration: 9, ease: 'easeInOut' }}
        />

        <div className="container-xl relative z-10 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
          >
            <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black text-white mb-6">
              Ready to Book?
            </motion.h2>
            <motion.p variants={itemVariants} className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Join thousands of satisfied attendees enjoying premium event experiences with real-time seat booking and instant QR tickets.
            </motion.p>
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/events" className="group rounded-full bg-gradient-to-r from-[#D8125B] to-[#E6246E] px-10 py-5 font-bold text-white shadow-xl shadow-[#D8125B]/40 hover:shadow-2xl hover:shadow-[#D8125B]/60 transition hover:-translate-y-1 flex items-center justify-center gap-2">
                Explore Events
                <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link to="/bookings" className="rounded-full border-2 border-white/30 px-10 py-5 font-bold text-white hover:border-[#D8125B] hover:bg-[#D8125B]/20 transition">
                View My Bookings
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2E39] text-white py-16 border-t border-white/10">
        <div className="container-xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-black tracking-tighter mb-4">
                EVENT<span className="text-[#D8125B]">HUB</span>
              </h3>
              <p className="text-white/60 text-sm">Premium ticketing platform for unforgettable event experiences.</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link to="/events" className="hover:text-[#D8125B] transition">Browse Events</Link></li>
                <li><Link to="/bookings" className="hover:text-[#D8125B] transition">My Bookings</Link></li>
                <li><a href="#" className="hover:text-[#D8125B] transition">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-[#D8125B] transition">About Us</a></li>
                <li><a href="#" className="hover:text-[#D8125B] transition">Contact</a></li>
                <li><a href="#" className="hover:text-[#D8125B] transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-[#D8125B] transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#D8125B] transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#D8125B] transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/50">
            <p>&copy; 2026 EventHub. All rights reserved. | Premium Events, Exceptional Experiences</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
