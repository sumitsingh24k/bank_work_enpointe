import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret_in_production';

export const verifyToken = (req, res, next) => {
  const auth = req.headers.authorization || req.headers.Authorization;
  if (!auth) return res.status(401).json({ success: false, message: 'No token provided' });

  // support both "Bearer <token>" and raw token
  const token = auth.startsWith('Bearer ') ? auth.split(' ')[1] : auth;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export const requireRole = (role) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Unauthorized' });
  if (req.user.role !== role) return res.status(403).json({ success: false, message: 'Forbidden' });
  next();
};

export default { verifyToken, requireRole };
