const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Check if database exists
    const dbPath = process.env.DATABASE_URL?.replace('file:', '') || './dev.db';
    const dbExists = fs.existsSync(dbPath);
    
    if (!dbExists) {
      console.log('📦 Database not found, creating and seeding...');
      
      // Push schema to create database
      execSync('npx prisma db push', { stdio: 'inherit' });
      
      // Seed the database
      execSync('npm run db:seed', { stdio: 'inherit' });
      
      console.log('✅ Database initialized and seeded successfully!');
    } else {
      console.log('📊 Database already exists, skipping initialization');
    }
    
    // Start the Next.js application
    console.log('🌐 Starting Next.js application...');
    execSync('npm start', { stdio: 'inherit' });
    
  } catch (error) {
    console.error('❌ Error during initialization:', error);
    process.exit(1);
  }
}

initializeDatabase();
