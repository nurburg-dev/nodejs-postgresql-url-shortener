---
title: URL Shortener Backend API
video: https://www.youtube.com/watch?v=7ySVWcFHz98
tags:
  - postgresql
  - nodejs
  - typescript
  - rest-api
summary: Design and implement a URL shortener backend API for an e-commerce company that needs to share product URLs on social networks with better click-through rates.
---

## Overview

Design and implement a URL shortener backend API for an e-commerce company that needs to share product URLs on social networks. Shorter URLs have been observed to have better click-through rates.

## Functional Requirements

### 1. Auto-Generated Short URL API

Create an API endpoint that generates a short key for any given long URL. The key should be as short as possible while maintaining uniqueness.

**Endpoint:** `POST /api/short_url`

**Request Body:**
```json
{
  "long_url": "https://www.myntra.com/sports-shoes/nike/nike-experience-run-11-womens-road-running-shoes/30739789/buy"
}
```

**Response:**
```json
{
  "key": "abcdefgh"
}
```

### 2. Custom Short URL API

Create an API endpoint that allows users to provide a custom key for their short URL.

**Endpoint:** `POST /api/short_url/custom`

**Request Body:**
```json
{
  "key": "summer-sales",
  "long_url": "https://www.myntra.com/sports-shoes/nike/nike-experience-run-11-womens-road-running-shoes/30739789/buy"
}
```

**Response:**
```json
{
  "key": "summer-sales"
}
```

### 3. Redirect API

Given a short key, redirect users to the original long URL.

**Endpoint:** `GET /{key}`

**Example:** `GET /summer-sales` should redirect to the original long URL.

## Non-Functional Requirements

1. **Data Persistence**: Use PostgreSQL or MySQL to store URL mappings
2. **Concurrency**: Design to handle race conditions properly
3. **Scalability**: Support approximately 1 million requests per day
4. **Uniqueness**: All short URL keys must be unique across the system

## Setup Instructions

### Database Setup

1. **Initialize the database schema**: Run the SQL script to create the required tables and indexes:
   ```bash
   psql -h urlshortenerpostgresql -U urluser -d urlshortener -f src/db/init.sql
   ```

## Implementation Guidelines

- Use TypeScript with Express.js framework
- Implement proper error handling and validation
- Follow RESTful API conventions
- Ensure database queries are optimized for performance
- Add appropriate indexes for fast lookups
- Handle edge cases like duplicate keys gracefully

## Database Schema

The application should use a table to store URL mappings with the following structure:
- `id`: Primary key (auto-increment)
- `key`: Unique short key (indexed)
- `long_url`: Original URL to redirect to
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

## Success Criteria

- All API endpoints work as specified
- Short keys are generated efficiently and remain unique
- Redirects work correctly for both auto-generated and custom keys
- System handles concurrent requests without data corruption
- Database queries are optimized for performance