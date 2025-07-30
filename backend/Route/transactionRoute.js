import express from 'express';
import { getTransactionModelSummary, getMonthlySummary ,addCredit,addDebit, deleteData} from '../controllers/transactionController.js';
import requireAuth from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/summary',requireAuth, getTransactionModelSummary);
router.get('/monthly-summary',requireAuth, getMonthlySummary);
router.post('/credit',requireAuth,addCredit)
router.post('/debit',requireAuth,addDebit)
router.post('/delete/:id',requireAuth,deleteData);
export default router;
