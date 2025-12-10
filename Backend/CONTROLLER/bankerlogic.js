import jwt from 'jsonwebtoken';
import Usermodel from '../Schema/Userschema.js';
import Customermodel from '../Schema/Account.js';
import Transactionmodel from '../Schema/Transaction.js';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

export const Registercontroller = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Usermodel({
      name,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    // create an account entry for customers
    if (role === 'customer') {
      const acc = new Customermodel({ userId: newUser._id, balance: 0 });
      await acc.save();
    }

    return res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const Logincontroller = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const user = await Usermodel.findOne({ email });
    if (!user || user.role !== role) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      role: user.role,
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Banker-only: list customers with balances
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Usermodel.find({ role: 'customer' }).select('-password');

    const data = await Promise.all(
      customers.map(async (c) => {
        const acc = await Customermodel.findOne({ userId: c._id });
        return {
          id: c._id,
          name: c.name,
          email: c.email,
          balance: acc ? acc.balance : 0,
        };
      })
    );

    return res.json({ success: true, data });
  } catch (error) {
    console.error('getAllCustomers Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usermodel.findById(id).select('-password');
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    const acc = await Customermodel.findOne({ userId: id });

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: acc ? acc.balance : 0,
      },
    });
  } catch (error) {
    console.error('getCustomerById Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getCustomerTransactions = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Usermodel.findById(id);
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const acc = await Customermodel.findOne({ userId: id });
    const currentBalance = acc ? acc.balance : 0;

    const transactions = await Transactionmodel.find({ userId: id }).sort({ createdAt: -1 });

    // Compute balance_after_transaction for each transaction (starting from current balance backwards)
    let running = currentBalance;
    const mapped = transactions.map((t) => {
      const mappedTx = {
        id: t._id,
        transaction_type: t.type === 'deposit' ? 'Deposit' : 'Withdraw',
        amount: t.amount,
        created_at: t.createdAt || t.date,
        balance_after_transaction: null,
      };

      // set balance after as current running for this (since list is desc)
      mappedTx.balance_after_transaction = running;

      // adjust running backwards
      if (t.type === 'deposit') {
        running -= t.amount;
      } else {
        running += t.amount;
      }

      return mappedTx;
    });

    return res.json({ success: true, data: mapped });
  } catch (error) {
    console.error('getCustomerTransactions Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Customer-only: get own info
export const getMyInfo = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await Usermodel.findById(id).select('-password');
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    const acc = await Customermodel.findOne({ userId: id });

    return res.json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        balance: acc ? acc.balance : 0,
      },
    });
  } catch (error) {
    console.error('getMyInfo Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Customer-only: get own transactions
export const getMyTransactions = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await Usermodel.findById(id);
    if (!user || user.role !== 'customer') {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const acc = await Customermodel.findOne({ userId: id });
    const currentBalance = acc ? acc.balance : 0;

    const transactions = await Transactionmodel.find({ userId: id }).sort({ createdAt: -1 });

    let running = currentBalance;
    const mapped = transactions.map((t) => {
      const mappedTx = {
        id: t._id,
        transaction_type: t.type === 'deposit' ? 'Deposit' : 'Withdraw',
        amount: t.amount,
        created_at: t.createdAt || t.date,
        balance_after_transaction: null,
      };

      mappedTx.balance_after_transaction = running;

      if (t.type === 'deposit') {
        running -= t.amount;
      } else {
        running += t.amount;
      }

      return mappedTx;
    });

    return res.json({ success: true, data: mapped });
  } catch (error) {
    console.error('getMyTransactions Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Customer: deposit into own account
export const depositToMyAccount = async (req, res) => {
  try {
    const id = req.user && req.user.id;
    const { amount } = req.body;
    console.log('depositToMyAccount called by user:', id, 'body:', req.body);
    const value = Number(amount);
    if (!value || value <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const acc = await Customermodel.findOneAndUpdate(
      { userId: id },
      { $inc: { balance: value } },
      { new: true }
    );

    if (!acc) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // record transaction
    const tx = await Transactionmodel.create({ userId: id, type: 'deposit', amount: value });

    return res.json({ success: true, message: 'Deposit successful', balance: acc.balance, transaction: tx });
  } catch (error) {
    console.error('depositToMyAccount Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Customer: withdraw from own account
export const withdrawFromMyAccount = async (req, res) => {
  try {
    const id = req.user && req.user.id;
    const { amount } = req.body;
    console.log('withdrawFromMyAccount called by user:', id, 'body:', req.body);
    const value = Number(amount);
    if (!value || value <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    // atomic update only if sufficient balance
    const updated = await Customermodel.findOneAndUpdate(
      { userId: id, balance: { $gte: value } },
      { $inc: { balance: -value } },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({ success: false, message: 'Insufficient Funds' });
    }

    const tx = await Transactionmodel.create({ userId: id, type: 'withdraw', amount: value });

    return res.json({ success: true, message: 'Withdrawal successful', balance: updated.balance, transaction: tx });
  } catch (error) {
    console.error('withdrawFromMyAccount Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
