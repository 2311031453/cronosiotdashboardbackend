//server.js
import app from './app.mjs';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.API_PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});