//app.mjs
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import apiRouter from './routes/api.mjs';
import authRouter from './routes/auth.mjs'; // Tambahkan ini
import './controllers/mqttController.mjs'; // Initialize MQTT service

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api', apiRouter);
app.use('/api/auth', authRouter); // Tambahkan route auth

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;