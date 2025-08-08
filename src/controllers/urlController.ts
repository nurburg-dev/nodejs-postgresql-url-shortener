import { Request, Response } from 'express';

export const createShortUrl = async (req: Request, res: Response) => {
  try {
    const { long_url } = req.body;
    
    if (!long_url) {
      return res.status(400).json({ error: 'long_url is required' });
    }

    const key = 'abcdefgh';
    
    res.status(201).json({ key });
  } catch (error) {
    console.error('Error creating short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createCustomShortUrl = async (req: Request, res: Response) => {
  try {
    const { key, long_url } = req.body;
    
    if (!key || !long_url) {
      return res.status(400).json({ error: 'key and long_url are required' });
    }

    res.status(201).json({ key });
  } catch (error) {
    console.error('Error creating custom short URL:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const redirectToUrl = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    res.status(404).json({ error: 'Key not found' });
  } catch (error) {
    console.error('Error redirecting:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};