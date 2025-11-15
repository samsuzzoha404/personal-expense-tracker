import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

class Transaction {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('transactions');
  }

  static async findByUserId(userId, filters = {}) {
    const collection = await this.getCollection();
    const query = { userId };

    // Apply filters
    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.startDate || filters.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        query.date.$lte = new Date(filters.endDate);
      }
    }

    return await collection.find(query).sort({ date: -1 }).toArray();
  }

  static async findById(id, userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ 
      _id: new ObjectId(id),
      userId 
    });
  }

  static async create(transactionData) {
    const collection = await this.getCollection();
    const transaction = {
      ...transactionData,
      date: new Date(transactionData.date),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(transaction);
    return { ...transaction, _id: result.insertedId };
  }

  static async update(id, userId, updateData) {
    const collection = await this.getCollection();
    const updates = {
      ...updateData,
      updatedAt: new Date()
    };
    
    if (updateData.date) {
      updates.date = new Date(updateData.date);
    }

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id), userId },
      { $set: updates },
      { returnDocument: 'after' }
    );
    
    return result;
  }

  static async delete(id, userId) {
    const collection = await this.getCollection();
    const result = await collection.deleteOne({ 
      _id: new ObjectId(id),
      userId 
    });
    
    return result.deletedCount > 0;
  }

  static async getStats(userId, startDate, endDate) {
    const collection = await this.getCollection();
    const query = { userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await collection.find(query).toArray();
    
    const stats = {
      totalIncome: 0,
      totalExpenses: 0,
      balance: 0,
      categoryBreakdown: {}
    };

    transactions.forEach(transaction => {
      if (transaction.type === 'income') {
        stats.totalIncome += transaction.amount;
      } else {
        stats.totalExpenses += transaction.amount;
        
        if (!stats.categoryBreakdown[transaction.category]) {
          stats.categoryBreakdown[transaction.category] = 0;
        }
        stats.categoryBreakdown[transaction.category] += transaction.amount;
      }
    });

    stats.balance = stats.totalIncome - stats.totalExpenses;

    return stats;
  }
}

export default Transaction;
