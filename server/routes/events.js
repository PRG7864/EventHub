import express from 'express';
import pool from '../config/db.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Create event (admin only)
router.post('/', authenticateToken, async (req, res) => {
  let connection;
  try {
    const { title, description, location, date, total_seats, price, img } = req.body;
    const totalSeats = Number(total_seats);
    const eventPrice = Number(price);

    if (!title || !location || !date || !totalSeats || !eventPrice) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Number.isInteger(totalSeats) || totalSeats < 1 || eventPrice < 0) {
      return res.status(400).json({ error: 'Seats and price must be valid positive numbers' });
    }

    connection = await pool.getConnection();
    await connection.query(
      'INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || '', location, new Date(date), totalSeats, totalSeats, eventPrice, img || null]
    );

    res.status(201).json({ message: 'Event created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get all events with search/filter
router.get('/', async (req, res) => {
  try {
    const { search, location, date, sort } = req.query;

    let query = 'SELECT * FROM events WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (title LIKE ? OR location LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (location) {
      query += ' AND location = ?';
      params.push(location);
    }

    if (date === 'upcoming') {
      query += ' AND date > NOW()';
    } else if (date === 'past') {
      query += ' AND date < NOW()';
    }

    if (sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else if (sort === 'date_asc') {
      query += ' ORDER BY date ASC';
    } else {
      query += ' ORDER BY date DESC';
    }

    const connection = await pool.getConnection();
    const [events] = await connection.query(query, params);
    connection.release();

    res.json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get event by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    const [events] = await connection.query('SELECT * FROM events WHERE id = ?', [id]);
    connection.release();

    if (events.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(events[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event (admin only)
router.put('/:id', authenticateToken, async (req, res) => {
  let connection;
  let transactionOpen = false;
  try {
    const { id } = req.params;
    const { title, description, location, date, total_seats, price, img } = req.body;
    const totalSeats = Number(total_seats);
    const eventPrice = Number(price);

    if (!title || !location || !date || !totalSeats || eventPrice < 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!Number.isInteger(totalSeats) || totalSeats < 1) {
      return res.status(400).json({ error: 'Total seats must be at least 1' });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();
    transactionOpen = true;

    const [events] = await connection.query('SELECT total_seats, available_seats FROM events WHERE id = ? FOR UPDATE', [id]);
    if (events.length === 0) {
      await connection.rollback();
      return res.status(404).json({ error: 'Event not found' });
    }

    const bookedSeats = Math.max(0, events[0].total_seats - events[0].available_seats);
    if (totalSeats < bookedSeats) {
      await connection.rollback();
      return res.status(400).json({ error: `Total seats cannot be less than already booked seats (${bookedSeats})` });
    }

    const availableSeats = totalSeats - bookedSeats;
    await connection.query(
      'UPDATE events SET title = ?, description = ?, location = ?, date = ?, total_seats = ?, available_seats = ?, price = ?, img = ? WHERE id = ?',
      [title, description || '', location, new Date(date), totalSeats, availableSeats, eventPrice, img || null, id]
    );
    await connection.commit();
    transactionOpen = false;

    req.app.locals.io.emit('seatUpdate', {
      event_id: Number(id),
      available_seats: availableSeats
    });

    res.json({ message: 'Event updated successfully' });
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

// Delete event (admin only)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const connection = await pool.getConnection();
    await connection.query('DELETE FROM events WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
