require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const cookieParser = require('cookie-parser');
const { protect } = require('./middleware/auth.middleware');

// initialize application
const app = express();
const PORT = process.env.PORT || 5000;

//connect database
connectDB();

// middlewear
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, //Allowed to cross origin with cookie
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
})); 
app.use(express.json()); 
app.use(cookieParser());

//router
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// route testing
app.get('/', (req, res) => {
  res.send(' Bullet Note backend is running');
});

// launch
app.listen(PORT, () => {
  console.log(`🚀 running on http://localhost:${PORT}`);
});