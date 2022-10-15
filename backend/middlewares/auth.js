const jwt = require('jsonwebtoken');
// const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const asyncErrorHandler = require('./asyncErrorHandler');
const db = require('../config/db');

exports.isAuthenticatedUser = asyncErrorHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new ErrorHandler('Please Login to Access', 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  const { rows } = await db.query('SELECT * FROM users WHERE user_id = $1', [
    decodedData.id,
  ]);

  req.user = rows[0];
  next();
});

exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role: ${req.user.role} is not allowed`, 403)
      );
    }
    next();
  };
};
