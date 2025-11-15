import { connectToDatabase } from './config/database.js';

// This script adds dummy data for YOUR Firebase user ID
// Usage: node server/seed-for-user.js YOUR_FIREBASE_UID

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Groceries',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Bonus',
  'Refund',
];

function getRandomDate() {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 90);
  const date = new Date(now);
  date.setDate(date.getDate() - daysAgo);
  return date;
}

function getRandomAmount(min, max) {
  return Math.round((Math.random() * (max - min) + min) * 100) / 100;
}

const EXPENSE_DESCRIPTIONS = [
  'Lunch at restaurant',
  'Coffee and snacks',
  'Grocery shopping',
  'Gas for car',
  'Uber ride',
  'Movie tickets',
  'New clothes',
  'Electric bill',
  'Internet bill',
  'Gym membership',
  'Books and supplies',
  'Medical checkup',
  'Pharmacy items',
  'Weekend trip',
  'Hair salon',
  'Online shopping',
  'Fast food',
  'Dinner with friends',
  'Taxi fare',
  'Streaming subscription',
];

const INCOME_DESCRIPTIONS = [
  'Monthly salary',
  'Freelance project payment',
  'Investment return',
  'Birthday gift',
  'Year-end bonus',
  'Tax refund',
  'Consulting work',
  'Part-time job',
  'Stock dividend',
  'Client payment',
];

function generateDummyTransactions(userId, count) {
  const transactions = [];
  
  for (let i = 0; i < count; i++) {
    const isExpense = Math.random() > 0.3;
    const type = isExpense ? 'expense' : 'income';
    
    const category = isExpense
      ? EXPENSE_CATEGORIES[Math.floor(Math.random() * EXPENSE_CATEGORIES.length)]
      : INCOME_CATEGORIES[Math.floor(Math.random() * INCOME_CATEGORIES.length)];
    
    const description = isExpense
      ? EXPENSE_DESCRIPTIONS[Math.floor(Math.random() * EXPENSE_DESCRIPTIONS.length)]
      : INCOME_DESCRIPTIONS[Math.floor(Math.random() * INCOME_DESCRIPTIONS.length)];
    
    const amount = isExpense
      ? getRandomAmount(5, 500)
      : getRandomAmount(500, 5000);
    
    const date = getRandomDate();
    
    transactions.push({
      userId,
      type,
      amount,
      category,
      description,
      date,
      createdAt: date,
      updatedAt: date,
    });
  }
  
  return transactions;
}

async function seedForUser() {
  const userId = process.argv[2];
  
  if (!userId) {
    console.log('❌ Error: Please provide a user ID');
    console.log('');
    console.log('Usage: node server/seed-for-user.js YOUR_USER_ID');
    console.log('');
    console.log('Example:');
    console.log('  node server/seed-for-user.js abc123xyz456');
    console.log('');
    console.log('Or to use a test user:');
    console.log('  node server/seed-for-user.js user_demo_123');
    process.exit(1);
  }

  console.log('🌱 Starting database seeding for user...\n');
  console.log(`👤 User ID: ${userId}\n`);
  
  try {
    const db = await connectToDatabase();
    const transactionsCollection = db.collection('transactions');
    
    // Check if user already has data
    const existingCount = await transactionsCollection.countDocuments({ userId });
    
    if (existingCount > 0) {
      console.log(`⚠️  User already has ${existingCount} transactions`);
      console.log('');
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      
      await new Promise((resolve) => {
        rl.question('Do you want to delete existing data and create new? (yes/no): ', (answer) => {
          if (answer.toLowerCase() === 'yes') {
            console.log('');
            resolve(true);
          } else {
            console.log('\n❌ Cancelled. No changes made.');
            process.exit(0);
          }
          rl.close();
        });
      });
      
      console.log('🗑️  Clearing existing data...');
      await transactionsCollection.deleteMany({ userId });
      console.log('✅ Cleared existing data\n');
    }
    
    // Generate and insert transactions
    console.log('📝 Generating 50 transactions...');
    const transactions = generateDummyTransactions(userId, 50);
    
    const result = await transactionsCollection.insertMany(transactions);
    console.log(`✅ Inserted ${result.insertedCount} transactions\n`);
    
    // Calculate statistics
    const expenses = transactions.filter(t => t.type === 'expense');
    const income = transactions.filter(t => t.type === 'income');
    const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);
    const totalIncome = income.reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    console.log('═══════════════════════════════════════');
    console.log('📊 Statistics:');
    console.log(`   • Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`   • Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`   • Balance: $${balance.toFixed(2)}`);
    console.log(`   • Expense Transactions: ${expenses.length}`);
    console.log(`   • Income Transactions: ${income.length}`);
    console.log('═══════════════════════════════════════\n');
    
    console.log('🎉 Seeding Complete!');
    console.log('');
    console.log('✨ You can now:');
    console.log('   1. Login to your app with this user ID');
    console.log('   2. View your dashboard with data');
    console.log('   3. Test all features with realistic data');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedForUser();
