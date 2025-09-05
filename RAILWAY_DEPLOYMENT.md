# Railway Deployment Guide

## Prerequisites
1. Install Railway CLI: `npm install -g @railway/cli`
2. Login to Railway: `railway login`

## Deployment Steps

1. **Login to Railway:**
   ```bash
   railway login
   ```

2. **Initialize Railway project:**
   ```bash
   railway init
   ```

3. **Set environment variables:**
   ```bash
   railway variables set JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   ```

4. **Deploy:**
   ```bash
   railway up
   ```

5. **Seed the database:**
   ```bash
   railway run npm run db:seed
   ```

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Set to "production"

## Database

The SQLite database will be stored in the persistent volume at `/app/dev.db`

## Test Accounts

After deployment and seeding:
- Admin: admin@example.com / admin123
- Student: student1@example.com / student123
- Student: student2@example.com / student123

## Alternative: Render Deployment

If you prefer Render:

1. Connect your GitHub repository to Render
2. Set build command: `npm run build`
3. Set start command: `npm start`
4. Add environment variable: `JWT_SECRET`
5. Deploy

Render also supports persistent storage for SQLite databases.
