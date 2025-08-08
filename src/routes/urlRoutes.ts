import { Router } from 'express';
import { createShortUrl, createCustomShortUrl } from '../controllers/urlController';

const router = Router();

// Create short URL with auto-generated key
router.post('/short_url', createShortUrl);

// Create short URL with custom key
router.post('/short_url/custom', createCustomShortUrl);

export { router as urlRoutes };