import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { urlRoutes } from './routes/urlRoutes';
import { redirectToUrl } from './controllers/urlController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', urlRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'URL Shortener API is running' });
});

// Handle redirect at root level
app.get('/:key', redirectToUrl);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});