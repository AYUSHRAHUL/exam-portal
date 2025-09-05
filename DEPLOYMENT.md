# Deployment Guide

## Environment Variables Required

Before deploying to Vercel, you need to set up the following environment variables:

### Required Environment Variables:
- `DATABASE_URL`: PostgreSQL connection string (e.g., `postgresql://username:password@host:port/database`)
- `JWT_SECRET`: Secret key for JWT token generation (use a strong, random string)

### Setting up Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `DATABASE_URL`: Your PostgreSQL database URL
   - `JWT_SECRET`: A strong secret key (e.g., generate with `openssl rand -base64 32`)

## Database Setup

For production, you'll need a PostgreSQL database. You can use:
- Vercel Postgres (recommended)
- Supabase
- PlanetScale
- Any other PostgreSQL provider

## Deployment Steps

1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
3. Deploy: `vercel --prod`

## Test Accounts

After deployment and database seeding:
- Admin: admin@example.com / admin123
- Student: student1@example.com / student123
- Student: student2@example.com / student123
