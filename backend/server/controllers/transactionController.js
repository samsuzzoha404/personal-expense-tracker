import Transaction from '../models/Transaction.js';

// Get all transactions for a user
export const getTransactions = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const filters = {
      category: req.query.category,
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const transactions = await Transaction.findByUserId(userId, filters);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
};

// Get a single transaction
export const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const transaction = await Transaction.findById(id, userId);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
};

// Create a new transaction
export const createTransaction = async (req, res) => {
  try {
    console.log('📥 Received transaction request body:', JSON.stringify(req.body, null, 2));
    
    const { userId, type, amount, category, description, notes, date } = req.body;

    if (!userId || !type || !amount || !category || !date) {
      console.log('❌ Missing required fields:', { userId, type, amount, category, date });
      return res.status(400).json({ 
        error: 'userId, type, amount, category, and date are required' 
      });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ 
        error: 'type must be either "income" or "expense"' 
      });
    }

    const transactionData = {
      userId,
      type,
      amount: parseFloat(amount),
      category,
      description: description || '',
      notes: notes || '',
      date
    };

    console.log('💾 Saving transaction to MongoDB:', transactionData);
    const transaction = await Transaction.create(transactionData);
    console.log('✅ Transaction saved successfully:', transaction._id);
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('❌ Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
};

// Update a transaction
export const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updateData = {};
    const allowedFields = ['type', 'amount', 'category', 'description', 'notes', 'date'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'amount' ? parseFloat(req.body[field]) : req.body[field];
      }
    });

    if (updateData.type && !['income', 'expense'].includes(updateData.type)) {
      return res.status(400).json({ 
        error: 'type must be either "income" or "expense"' 
      });
    }

    const transaction = await Transaction.update(id, userId, updateData);
    
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
};

// Delete a transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const deleted = await Transaction.delete(id, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
};

// Get transaction statistics
export const getStats = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const { startDate, endDate } = req.query;
    const stats = await Transaction.getStats(userId, startDate, endDate);
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};
