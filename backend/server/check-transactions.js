import { connectToDatabase } from './config/database.js';

async function checkTransactions() {
  try {
    console.log('🔍 Connecting to MongoDB...');
    const db = await connectToDatabase();
    
    const transactions = db.collection('transactions');
    
    console.log('\n📊 Total transactions in database:');
    const count = await transactions.countDocuments();
    console.log(`   ${count} transactions found`);
    
    if (count > 0) {
      console.log('\n📝 Sample transactions:');
      const samples = await transactions.find().limit(5).toArray();
      
      samples.forEach((tx, index) => {
        console.log(`\n   Transaction ${index + 1}:`);
        console.log(`   - ID: ${tx._id}`);
        console.log(`   - User ID: ${tx.userId}`);
        console.log(`   - Type: ${tx.type}`);
        console.log(`   - Amount: $${tx.amount}`);
        console.log(`   - Category: ${tx.category}`);
        console.log(`   - Description: ${tx.description}`);
        console.log(`   - Date: ${tx.date}`);
      });
      
      console.log('\n👥 Unique users:');
      const users = await transactions.distinct('userId');
      console.log(`   Found ${users.length} unique user(s):`);
      users.forEach((userId, index) => {
        console.log(`   ${index + 1}. ${userId}`);
      });
    } else {
      console.log('\n   ℹ️  No transactions found in database');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTransactions();
