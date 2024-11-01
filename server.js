const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const todoRouter = require('./routes/todo');

const app = express();

mongoose.connect(process.env.MONGODB_CONNECT_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// CORS configuration
const corsOptions = {
  origin: ['https://todo-node-app.netlify.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/todos', todoRouter);

// Add this error handler after your routes
app.use((err, req, res, next) => {
  if (err.name === 'CORSError') {
    res.status(403).json({
      error: 'CORS error',
      message: 'Not allowed by CORS'
    });
  } else {
    next(err);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
}); 