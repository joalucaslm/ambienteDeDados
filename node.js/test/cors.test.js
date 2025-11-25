const request = require('supertest');
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configuration
const corsOptions = {
  origin: (origin, callback) => {
    const whitelist = (process.env.CORS_WHITELIST || 'http://localhost:5174,http://127.0.0.1:5500,http://127.0.0.1:3000,http://localhost:3000').split(',');
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Success' });
});

describe('CORS middleware', () => {
  it('should allow requests from whitelisted origins', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://localhost:5174');
    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5174');
  });

  it('should block requests from non-whitelisted origins', async () => {
    const response = await request(app)
      .get('/')
      .set('Origin', 'http://example.com');
    expect(response.status).toBe(500);
  });
});
