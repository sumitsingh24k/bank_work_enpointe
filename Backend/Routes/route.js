import express from 'express';
import {
	Registercontroller,
	Logincontroller,
	getAllCustomers,
	getCustomerById,
	getCustomerTransactions,
	getMyInfo,
	getMyTransactions,
	depositToMyAccount,
	withdrawFromMyAccount,
} from '../CONTROLLER/bankerlogic.js';
import { verifyToken, requireRole } from '../Middleware/auth.js';

const router = express.Router();

// registration aliases
router.post('/register', Registercontroller);
router.post('/signup', Registercontroller);

router.post('/login', Logincontroller);

// banker-protected routes
router.get('/banker/customers', verifyToken, requireRole('banker'), getAllCustomers);
router.get('/banker/customer/:id', verifyToken, requireRole('banker'), getCustomerById);
router.get(
	'/banker/customer/:id/transactions',
	verifyToken,
	requireRole('banker'),
	getCustomerTransactions
);

// customer self endpoints
router.get('/customer/me', verifyToken, requireRole('customer'), getMyInfo);
router.get('/customer/me/transactions', verifyToken, requireRole('customer'), getMyTransactions);
router.post('/customer/me/deposit', verifyToken, requireRole('customer'), depositToMyAccount);
router.post('/customer/me/withdraw', verifyToken, requireRole('customer'), withdrawFromMyAccount);

export default router;