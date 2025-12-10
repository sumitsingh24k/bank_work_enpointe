import express from 'express';
import connectDB from './Database/db_connect.js';
import router from './Routes/route.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

await connectDB();


app.use(cors());


app.use(express.json());

app.use('/', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
