# MongoDB Setup Guide

This project has been migrated from SQLite to MongoDB using Prisma. Follow these steps to set up your MongoDB database:

## 1. Create a MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account or sign in
3. Create a new cluster
4. Create a database user with read/write permissions
5. Get your connection string

### Option B: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/exam-portal`

## 2. Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net/exam-portal?retryWrites=true&w=majority"

# JWT Secret (keep this secure in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
```

**Important**: Make sure your `DATABASE_URL` includes the database name. The format should be:
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority`
- For local MongoDB: `mongodb://localhost:27017/database-name`

Replace `database-name` with your actual database name (e.g., `exam-portal`).

Replace the placeholders:
- `<username>`: Your MongoDB username
- `<password>`: Your MongoDB password
- `<cluster>`: Your MongoDB cluster name

## 3. Generate Prisma Client

After setting up your environment variables, run:

```bash
npm run postinstall
# or
npx prisma generate
```

## 4. Push Schema to Database

```bash
npx prisma db push
```

## 5. Seed the Database (Optional)

```bash
npm run db:seed
```

## Important Notes

- MongoDB requires a replica set for transactions. MongoDB Atlas provides this by default.
- The schema has been updated to use MongoDB ObjectId for all primary keys.
- All foreign key relationships now use `@db.ObjectId` for proper MongoDB compatibility.
- The `onDelete: Cascade` constraints have been removed as they don't apply to MongoDB.

## Troubleshooting

If you encounter issues:
1. Ensure your MongoDB cluster is running
2. Check that your connection string is correct
3. Verify that your database user has the necessary permissions
4. Make sure you're using a replica set (required for Prisma with MongoDB)
