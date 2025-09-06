const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Setup for Exam Portal');
console.log('================================\n');

console.log('You have two options for MongoDB:');
console.log('1. MongoDB Atlas (Cloud - Recommended)');
console.log('2. Local MongoDB (Local installation)\n');

rl.question('Choose option (1 or 2): ', (option) => {
  if (option === '1') {
    setupAtlas();
  } else if (option === '2') {
    setupLocal();
  } else {
    console.log('Invalid option. Please run the script again.');
    rl.close();
  }
});

function setupAtlas() {
  console.log('\n📋 MongoDB Atlas Setup:');
  console.log('1. Go to https://www.mongodb.com/atlas');
  console.log('2. Create a free account or sign in');
  console.log('3. Create a new cluster (free tier is fine)');
  console.log('4. Create a database user with read/write permissions');
  console.log('5. Get your connection string from "Connect" button\n');
  
  rl.question('Enter your MongoDB Atlas connection string: ', (connectionString) => {
    if (connectionString.includes('mongodb+srv://') && connectionString.includes('@') && connectionString.includes('.mongodb.net/')) {
      createEnvFile(connectionString);
    } else {
      console.log('❌ Invalid connection string format. Please make sure it includes:');
      console.log('- mongodb+srv://');
      console.log('- username:password@');
      console.log('- cluster.mongodb.net/');
      console.log('- database name after the slash');
      rl.close();
    }
  });
}

function setupLocal() {
  console.log('\n📋 Local MongoDB Setup:');
  console.log('1. Install MongoDB locally');
  console.log('2. Start MongoDB service');
  console.log('3. Make sure MongoDB is running on port 27017\n');
  
  const localConnectionString = 'mongodb://localhost:27017/exam-portal';
  console.log('Using local connection string:', localConnectionString);
  createEnvFile(localConnectionString);
}

function createEnvFile(connectionString) {
  const envContent = `# Database
DATABASE_URL="${connectionString}"

# JWT Secret (keep this secure in production)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-change-this-in-production"
`;

  try {
    fs.writeFileSync('.env', envContent);
    console.log('\n✅ .env file created successfully!');
    console.log('\n🚀 Next steps:');
    console.log('1. Run: npx prisma db push');
    console.log('2. Run: npm run db:seed (optional)');
    console.log('3. Run: npm run dev');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
  }
  
  rl.close();
}
