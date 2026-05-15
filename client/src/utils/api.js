import axios from 'axios'

const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// Log for debugging
console.log('Environment Variables:')
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('Using BACKEND_URL:', BACKEND_URL)

const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  withCredentials: true
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const adminLogin = (username, password) =>
  api.post('/admin/login', { username, password })

export const createEvent = (eventData) =>
  api.post('/events', eventData)

export const getEvents = (params) =>
  api.get('/events', { params })

export const getEventById = (id) =>
  api.get(`/events/${id}`)

export const updateEvent = (id, eventData) =>
  api.put(`/events/${id}`, eventData)

export const deleteEvent = (id) =>
  api.delete(`/events/${id}`)

export const createBooking = (bookingData) =>
  api.post('/bookings', bookingData)

export const getUserBookings = (email) =>
  api.get('/bookings', { params: { email } })

export const cancelBooking = (id) =>
  api.put(`/bookings/${id}/cancel`)

export const getEventBookings = (eventId) =>
  api.get(`/bookings/event/${eventId}`)

export default api
