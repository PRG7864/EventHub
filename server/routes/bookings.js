import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  let connection;
  let transactionOpen = false;
  try {
    const { event_id, name, email, mobile, quantity } = req.body;
    const ticketCount = Number(quantity);

    if (!event_id || !name || !email || !mobile || !ticketCount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Number.isInteger(ticketCount) || ticketCount < 1) {
      return res.status(400).json({ error: 'Ticket quantity must be at least 1' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionOpen = true;

    const [events] = await connection.query('SELECT * FROM events WHERE id = ? FOR UPDATE', [event_id]);
    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = events[0];
    if (event.available_seats < ticketCount) {
      await connection.rollback();
      return res.status(400).json({ error: 'Not enough available seats' });
    }

    const total_amount = Number(event.price) * ticketCount;

    const [result] = await connection.query(
      'INSERT INTO bookings (event_id, name, email, mobile, quantity, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
      [event_id, name, email, mobile, ticketCount, total_amount]
    );

    await connection.query(
      'UPDATE events SET available_seats = available_seats - ? WHERE id = ?',
      [ticketCount, event_id]
    );

    const [updatedEvents] = await connection.query('SELECT available_seats FROM events WHERE id = ?', [event_id]);
    await connection.commit();
    transactionOpen = false;

    const io = req.app.locals.io;
    io.emit('seatUpdate', {
      event_id: Number(event_id),
      available_seats: updatedEvents[0].available_seats
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking_id: result.insertId,
      total_amount
    });
  } catch (error) {
    if (connection && transactionOpen) {
      await connection.rollback();
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get bookings by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ error: 'Email parameter required' });
    }

    const connection = await pool.getConnection();
    const [bookings] = await connection.query(
      `SELECT b.*, e.title, e.date, e.location FROM bookings b
       JOIN events e ON b.event_id = e.id
       WHERE b.email = ?
       ORDER BY b.booking_date DESC`,
      [email]
    );
    connection.release();

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel booking
router.put('/:id/cancel', async (req, res) => {
  let connection;
  let transactionOpen = false;
  try {
    const { id } = req.params;

    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionOpen = true;

    const [bookings] = await connection.query('SELECT * FROM bookings WHERE id = ? FOR UPDATE', [id]);
    if (bookings.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookings[0];

    if (booking.status === 'cancelled') {
      await connection.rollback();
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    await connection.query('UPDATE bookings SET status = ? WHERE id = ?', ['cancelled', id]);

    await connection.query(
      'UPDATE events SET available_seats = LEAST(total_seats, available_seats + ?) WHERE id = ?',
      [booking.quantity, booking.event_id]
    );

    const [updatedEvents] = await connection.query('SELECT available_seats FROM events WHERE id = ?', [booking.event_id]);
    await connection.commit();
    transactionOpen = false;

    const io = req.app.locals.io;
    io.emit('seatUpdate', {
      event_id: booking.event_id,
      available_seats: updatedEvents[0].available_seats
    });

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    if (connection && transactionOpen) {
      await connection.rollback();
    }
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get all bookings for an event (admin)
router.get('/event/:event_id', async (req, res) => {
  try {
    const { event_id } = req.params;

    const connection = await pool.getConnection();
    const [bookings] = await connection.query(
      'SELECT * FROM bookings WHERE event_id = ? ORDER BY booking_date DESC',
      [event_id]
    );
    connection.release();

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
