import { ObjectId } from 'mongodb';
import { getDatabase } from '../config/database.js';

class Budget {
  static async getCollection() {
    const db = await getDatabase();
    return db.collection('budgets');
  }

  static async findByUserId(userId) {
    const collection = await this.getCollection();
    return await collection.find({ userId }).toArray();
  }

  static async findById(id, userId) {
    const collection = await this.getCollection();
    return await collection.findOne({ 
      _id: new ObjectId(id),
      userId 
    });
  }

  static async create(budgetData) {
    const collection = await this.getCollection();
    const budget = {
      ...budgetData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await collection.insertOne(budget);
    return { ...budget, _id: result.insertedId };
  }

  static async update(id, userId, updateData) {
    const collection = await this.getCollection();
    const updates = {
      ...updateData,
      updatedAt: new Date()
    };

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

  static async getTotalMonthlyBudget(userId) {
    const collection = await this.getCollection();
    const budgets = await collection.find({ 
      userId,
      period: 'monthly'
    }).toArray();
    
    const total = budgets.reduce((sum, budget) => sum + budget.amount, 0);
    return total;
  }
}

export default Budget;
