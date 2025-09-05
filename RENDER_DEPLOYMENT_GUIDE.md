# Render Deployment Guide for Exam Portal

## Prerequisites
1. GitHub repository with your code
2. Render account (free tier available)

## Deployment Steps

### 1. Prepare Your Repository
Make sure your code is pushed to GitHub with all the configuration files:
- `render.yaml` (deployment configuration)
- `scripts/start.js` (database initialization script)
- Updated `package.json` with start:render script

### 2. Deploy to Render

#### Option A: Using render.yaml (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Render will automatically detect the `render.yaml` file
5. Click "Apply" to deploy

#### Option B: Manual Configuration
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: exam-portal
   - **Environment**: Node
   - **Plan**: Free
   - **Build Command**: `npm install && npx prisma generate && npm run build`
   - **Start Command**: `npm run start:render`
   - **Environment Variables**:
     - `NODE_ENV`: production
     - `JWT_SECRET`: (generate a strong secret)
     - `DATABASE_URL`: file:/opt/render/project/data/exam-portal.db

### 3. Add Persistent Disk
1. In your service settings, go to "Disk"
2. Add a new disk:
   - **Name**: exam-portal-disk
   - **Mount Path**: /opt/render/project/data
   - **Size**: 1GB (minimum)

### 4. Deploy
Click "Create Web Service" and wait for deployment to complete.

## Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `NODE_ENV` | production | Node environment |
| `JWT_SECRET` | (generated) | JWT secret for authentication |
| `DATABASE_URL` | file:/opt/render/project/data/exam-portal.db | SQLite database path |

## Database Initialization

The application will automatically:
1. Create the SQLite database on first run
2. Run Prisma migrations
3. Seed the database with test data

## Test Accounts

After successful deployment:
- **Admin**: admin@example.com / admin123
- **Student 1**: student1@example.com / student123
- **Student 2**: student2@example.com / student123

## Troubleshooting

### Common Issues:
1. **Database not persisting**: Ensure the disk is properly mounted
2. **Build failures**: Check that all dependencies are in package.json
3. **Startup errors**: Check the logs in Render dashboard

### Logs
- View logs in Render dashboard under your service
- Check both build and runtime logs

## Features Included

✅ SQLite database with persistent storage
✅ User authentication (JWT)
✅ Admin and student roles
✅ Exam creation and management
✅ Question bank system
✅ Real-time exam taking
✅ Security features (tab lock, fullscreen)
✅ Results and leaderboard
✅ Responsive design

## Cost

- **Free Tier**: 750 hours/month
- **Disk Storage**: 1GB included
- **Bandwidth**: 100GB/month

Perfect for development and small-scale production use!
