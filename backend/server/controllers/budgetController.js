import Budget from '../models/Budget.js';

// Get all budgets for a user
export const getBudgets = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const budgets = await Budget.findByUserId(userId);
    res.json(budgets);
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ error: 'Failed to fetch budgets' });
  }
};

// Get a single budget
export const getBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const budget = await Budget.findById(id, userId);
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Error fetching budget:', error);
    res.status(500).json({ error: 'Failed to fetch budget' });
  }
};

// Get total monthly budget
export const getTotalMonthlyBudget = async (req, res) => {
  try {
    const userId = req.query.userId;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const total = await Budget.getTotalMonthlyBudget(userId);
    res.json({ total });
  } catch (error) {
    console.error('Error fetching total budget:', error);
    res.status(500).json({ error: 'Failed to fetch total budget' });
  }
};

// Create a new budget
export const createBudget = async (req, res) => {
  try {
    const { userId, category, amount, period } = req.body;

    if (!userId || !category || !amount || !period) {
      return res.status(400).json({ 
        error: 'userId, category, amount, and period are required' 
      });
    }

    if (!['monthly', 'weekly', 'yearly'].includes(period)) {
      return res.status(400).json({ 
        error: 'period must be either "monthly", "weekly", or "yearly"' 
      });
    }

    const budgetData = {
      userId,
      category,
      amount: parseFloat(amount),
      period
    };

    const budget = await Budget.create(budgetData);
    res.status(201).json(budget);
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ error: 'Failed to create budget' });
  }
};

// Update a budget
export const updateBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.body.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const updateData = {};
    const allowedFields = ['category', 'amount', 'period'];
    
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = field === 'amount' ? parseFloat(req.body[field]) : req.body[field];
      }
    });

    if (updateData.period && !['monthly', 'weekly', 'yearly'].includes(updateData.period)) {
      return res.status(400).json({ 
        error: 'period must be either "monthly", "weekly", or "yearly"' 
      });
    }

    const budget = await Budget.update(id, userId, updateData);
    
    if (!budget) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json(budget);
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ error: 'Failed to update budget' });
  }
};

// Delete a budget
export const deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const deleted = await Budget.delete(id, userId);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Budget not found' });
    }

    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ error: 'Failed to delete budget' });
  }
};
