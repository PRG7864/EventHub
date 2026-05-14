-- Create Database
CREATE DATABASE IF NOT EXISTS event_booking;
USE event_booking;

-- Events Table
CREATE TABLE IF NOT EXISTS events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  location VARCHAR(255),
  date DATETIME NOT NULL,
  total_seats INT NOT NULL,
  available_seats INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  img VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_events_date (date),
  INDEX idx_events_location (location)
);

-- Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status ENUM('confirmed', 'cancelled') DEFAULT 'confirmed',
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  INDEX idx_bookings_email (email),
  INDEX idx_bookings_event_id (event_id)
);

-- Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

-- Seed Admin User (password: admin123 hashed with bcrypt)
INSERT INTO admins (username, password) VALUES
('admin', '$2a$10$I4DUmVZ8CL9dLzr8k0.xXeJr8xGhE0R5/B.bsVVV9FXO5Iy1g8gFG')
ON DUPLICATE KEY UPDATE username = VALUES(username);

-- Seed Sample Events
INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Rock Concert', 'A high-energy live concert with national touring artists and premium stage production.', 'New York', DATE_ADD(NOW(), INTERVAL 30 DAY), 5000, 4500, 99.99, 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Rock Concert' AND location = 'New York');

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Tech Conference', 'A full-day technology summit with product leaders, engineering talks, and startup showcases.', 'San Francisco', DATE_ADD(NOW(), INTERVAL 20 DAY), 1000, 800, 149.99, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Tech Conference' AND location = 'San Francisco');

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Art Exhibition', 'A curated contemporary art exhibition featuring installations, photography, and live talks.', 'Los Angeles', DATE_ADD(NOW(), INTERVAL 45 DAY), 500, 450, 49.99, 'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Art Exhibition' AND location = 'Los Angeles');

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Comedy Night', 'A sharp stand-up showcase with headline comedians, reserved seating, and a relaxed lounge setting.', 'Chicago', DATE_ADD(NOW(), INTERVAL 15 DAY), 300, 200, 39.99, 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Comedy Night' AND location = 'Chicago');

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Food Festival', 'A weekend market of regional chefs, tastings, workshops, and late evening pop-up dinners.', 'New York', DATE_ADD(NOW(), INTERVAL 25 DAY), 2000, 1500, 29.99, 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Food Festival' AND location = 'New York');

INSERT INTO events (title, description, location, date, total_seats, available_seats, price, img)
SELECT 'Sports Championship', 'A stadium championship experience with reserved sections, fan zones, and live entertainment.', 'Los Angeles', DATE_ADD(NOW(), INTERVAL 60 DAY), 10000, 8000, 79.99, 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80'
WHERE NOT EXISTS (SELECT 1 FROM events WHERE title = 'Sports Championship' AND location = 'Los Angeles');
