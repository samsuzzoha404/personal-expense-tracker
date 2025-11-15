import express from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = express.Router();

// Transaction routes
router.get('/transactions', transactionController.getTransactions);
router.get('/transactions/stats', transactionController.getStats);
router.get('/transactions/:id', transactionController.getTransaction);
router.post('/transactions', transactionController.createTransaction);
router.put('/transactions/:id', transactionController.updateTransaction);
router.delete('/transactions/:id', transactionController.deleteTransaction);

export default router;
