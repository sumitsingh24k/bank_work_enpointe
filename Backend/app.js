import express from 'express';
import connectDB from './Database/db_connect.js';
import router from './Routes/route.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

await connectDB();

// Configure CORS to allow frontend origin(s) (set FRONTEND_URL in Backend/.env)
// Accept a comma-separated list or a single URL. For local dev, also allow 5174.
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const extraFrontends = ['http://localhost:5174'];
const allowedOrigins = Array.isArray(FRONTEND_URL)
    ? FRONTEND_URL
    : String(FRONTEND_URL)
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .concat(extraFrontends);
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true); // allow server-to-server or tools
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error('CORS policy: origin not allowed'));
        },
    })
);
app.use(express.json());

console.log('Allowed frontend origins for CORS:', allowedOrigins.join(', '));

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});