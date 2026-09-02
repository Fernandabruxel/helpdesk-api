-require('dotenv').config();
const cors = require('cors');

const corsMiddleware = cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
});

module.exports = corsMiddleware;