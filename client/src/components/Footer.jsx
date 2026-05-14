import React from 'react'
import { motion } from 'framer-motion'

function Footer() {
  return (
    <motion.footer
      className="border-t border-slate-200 bg-slate-950 text-white mt-16"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="container-xl py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-md bg-white text-sm font-extrabold text-slate-950">
                EH
              </div>
              <span className="font-extrabold text-lg">EventHub</span>
            </div>
            <p className="text-slate-400 text-sm leading-6">
              A polished booking workspace for events, tickets, and live seat inventory.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="/" className="hover:text-white transition">Home</a></li>
              <li><a href="/events" className="hover:text-white transition">Events</a></li>
              <li><a href="/bookings" className="hover:text-white transition">My Bookings</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition">FAQ</a></li>
              <li><a href="#" className="hover:text-white transition">Contact</a></li>
              <li><a href="#" className="hover:text-white transition">Terms</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">
              Subscribe for event updates
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full rounded-md border border-white/10 bg-white/10 px-3 py-2 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-white/30"
            />
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <p className="text-center text-slate-500 text-sm">
            © 2026 EventHub. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
