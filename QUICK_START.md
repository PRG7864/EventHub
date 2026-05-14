# 🚀 How to Run Smart Event Booking System

## Step-by-Step Setup Guide

### **STEP 1: Extract the Project** 📦

```bash
# Go to the downloads or wherever you extracted the zip
cd smart-event-booking
```

---

### **STEP 2: Setup MySQL Database** 🗄️

#### Option A: Using Command Line
```bash
# Make sure MySQL is running
mysql -u root -p < schema.sql

# Enter your MySQL root password when prompted
```

#### Option B: Using MySQL Workbench
1. Open MySQL Workbench
2. Click on "File" → "Open SQL Script"
3. Select `schema.sql`
4. Click the lightning bolt icon to execute
5. Check the output tab for success message

#### Option C: Manual Setup
1. Open your MySQL client
2. Run these commands:
```sql
CREATE DATABASE event_booking;
USE event_booking;
-- Then paste entire schema.sql content
```

**Verify Database is Created:**
```bash
mysql -u root -p -e "USE event_booking; SHOW TABLES;"
```

You should see: `admins`, `bookings`, `events`

---

### **STEP 3: Setup Backend Server** ⚙️

```bash
# Navigate to server directory
cd server

# Install all dependencies
npm install
# OR if you use yarn
yarn install

# Create .env file
cp .env.example .env

# Edit .env file with your database details
```

**Edit `server/.env` file** (use VS Code or any text editor):

```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=event_booking
PORT=5001
CLIENT_URL=http://localhost:5173
JWT_SECRET=your-super-secret-key-12345
```

**Start the Backend:**

```bash
# For development (with auto-restart)
npm run dev

# OR for production
npm start
```

You should see:
```
Server running on port 5001
```

✅ **Backend is now running!**

---

### **STEP 4: Setup Frontend** 🎨

**Open a NEW terminal window** and run:

```bash
# Navigate to client directory
cd client

# Install all dependencies
npm install
# OR if you use yarn
yarn install

# Create .env.local file
cp .env.example .env.local

# The default values should work:
# VITE_BACKEND_URL=http://localhost:5001
# VITE_SOCKET_URL=http://localhost:5001
```

**Start the Frontend:**

```bash
npm run dev
```

You should see:
```
VITE v5.0.0 ready in XXX ms

➜  Local:   http://localhost:5173/
```

✅ **Frontend is now running!**

---

### **STEP 5: Open in Browser** 🌐

Click the link or open: **http://localhost:5173**

You should see:
- Beautiful landing page with parallax effects
- Navigation bar at top
- Featured events section

---

## 🔓 Login as Admin

1. Click "Admin" in the top navigation
2. Enter credentials:
   - **Username**: `admin`
   - **Password**: `admin123`
3. You'll see the Admin Dashboard to create/manage events

---

## 📋 Checklist - Make Sure Everything Works

- [ ] **MySQL** - Database is running
- [ ] **Backend** - Server running on port 5001
- [ ] **Frontend** - App running on port 5173
- [ ] **Homepage** - Loads without errors
- [ ] **Events Page** - Shows sample events
- [ ] **Admin Login** - Can log in with admin/admin123
- [ ] **Real-time** - Try booking an event - seat count updates in real-time

---

## 🧪 Test the Application

### **As a User:**
1. Go to http://localhost:5173/events
2. Click on any event
3. Select number of tickets
4. Click "Proceed to Booking"
5. Fill in form and submit
6. Download your QR code ticket ✅

### **As an Admin:**
1. Go to http://localhost:5173/admin/login
2. Login with `admin` / `admin123`
3. Create a new event
4. View bookings
5. Edit/Delete events ✅

---

## 🚨 Common Issues & Solutions

### **Backend Won't Start**

```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solution**: MySQL is not running
```bash
# Start MySQL
mysql.server start          # macOS
sudo systemctl start mysql  # Linux
# Windows: Use MySQL Services from Services app
```

---

### **Frontend Won't Connect to Backend**

```
Error: Network Error
```
**Solution**: Make sure both are running
```bash
# Check backend is running
curl http://localhost:5001/api/health

# If returns {"status":"OK"} - it's running ✅
# If connection refused - restart backend ❌
```

---

### **Database Error: Access Denied**

```
Error: ER_ACCESS_DENIED_FOR_USER
```
**Solution**: Wrong database password in `.env`
```bash
# Check your MySQL password
mysql -u root -p

# Update .env with correct password
# Then restart backend with: npm start
```

---

### **Port Already in Use**

```
Error: listen EADDRINUSE: address already in use :::5001
```
**Solution**: Change port or kill process
```bash
# Kill process on port 5001 (macOS/Linux)
lsof -ti:5001 | xargs kill -9

# OR change PORT in server/.env to 5002
# Then update client to: VITE_BACKEND_URL=http://localhost:5002
```

---

## 📱 Running on Different Machine

### If Frontend & Backend on Same Machine:
Everything works as-is! ✅

### If Backend on Different IP/Server:

**Frontend (.env.local):**
```
VITE_BACKEND_URL=http://192.168.1.100:5001
VITE_SOCKET_URL=http://192.168.1.100:5001
```

**Backend (server/.env):**
```
CLIENT_URL=http://192.168.1.100:5173
```

---

## 🔧 Useful Commands

```bash
# Check if port is in use
netstat -an | grep 5001    # macOS/Linux
netstat -ano | grep 5001   # Windows

# Install dependencies fresh
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Kill all Node processes
killall node                # macOS/Linux
taskkill /F /IM node.exe    # Windows

# View backend logs
npm run dev                 # Shows all logs

# Build frontend for production
npm run build               # Creates dist/ folder
```

---

## 📊 Project Running Successfully Looks Like:

### **Terminal 1 (Backend):**
```
$ npm run dev
[nodemon] starting `node server.js`
Server running on port 5001
New client connected: xyz123
```

### **Terminal 2 (Frontend):**
```
$ npm run dev
VITE v5.0.0 ready in 234 ms

➜  Local:   http://localhost:5173/
```

### **Browser:**
```
http://localhost:5173 loads with:
- EventHub logo ✓
- Navigation bar ✓
- "Discover & Book Amazing Events" headline ✓
- Featured events shown ✓
```

---

## ✅ Next Steps

Once everything is running:

1. **Browse Events** - http://localhost:5173/events
2. **Book a Ticket** - Complete the booking flow
3. **Check Admin Dashboard** - Manage events
4. **Try Real-time** - Book event on one device, see seat count update on another

---

## 💡 Tips

- Keep both terminals open while developing
- Check browser console (F12) for errors
- Check terminal for backend errors
- Use `npm run dev` for development (auto-restart)
- For production: `npm start`

---

## Need Help?

If something doesn't work:

1. **Check if MySQL is running**
   ```bash
   mysql -u root -p
   ```

2. **Check if ports are available**
   ```bash
   # Port 5001 for backend
   # Port 5173 for frontend
   ```

3. **Check logs in terminal** - Read error messages carefully!

4. **Restart everything** - Stop and start fresh

5. **Clear cache**
   ```bash
   cd client
   rm -rf node_modules
   npm install
   npm run dev
   ```

---

**Happy coding! 🚀**
