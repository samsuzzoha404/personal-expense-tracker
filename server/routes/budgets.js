import express from 'express';
import * as budgetController from '../controllers/budgetController.js';

const router = express.Router();

// Budget routes
router.get('/budgets', budgetController.getBudgets);
router.get('/budgets/total', budgetController.getTotalMonthlyBudget);
router.get('/budgets/:id', budgetController.getBudget);
router.post('/budgets', budgetController.createBudget);
router.put('/budgets/:id', budgetController.updateBudget);
router.delete('/budgets/:id', budgetController.deleteBudget);

export default router;
