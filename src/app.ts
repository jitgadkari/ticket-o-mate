import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import authRoutes from './routes/authRoutes';
import organizationRoutes from './routes/organizationRoutes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);


// Database connection
connectDatabase();
app.get('/', (req, res) => {
    res.send('Hello, world! working');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;