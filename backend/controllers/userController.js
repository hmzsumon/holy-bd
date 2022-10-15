const User = require('../models/userModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const sendToken = require('../utils/sendToken');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const cloudinary = require('cloudinary');
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register User
exports.registerUser = asyncErrorHandler(async (req, res, next) => {
  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
    folder: 'avatars',
    width: 150,
    crop: 'scale',
  });

  // create 6 digit customer id
  const customer_id = crypto.randomBytes(3).toString('hex');

  const {
    username,
    name,
    email,
    phone,
    password,
    address,
    city,
    state,
    country,
    zip,
    gender,
  } = req.body;

  // check if user already exists
  const { rows: existsUser } = await db.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );

  if (existsUser.length > 0) {
    return next(
      new ErrorHandler(`${existsUser[0].email}  already exists`, 400)
    );
  }

  // check username
  const { rows: existsUsername } = await db.query(
    'SELECT * FROM users WHERE username = $1',
    [username]
  );

  if (existsUsername.length > 0) {
    return next(
      new ErrorHandler(`${existsUsername[0].username}  already exists`, 400)
    );
  }

  // check phone
  const { rows: existsPhone } = await db.query(
    'SELECT * FROM users WHERE phone = $1',
    [phone]
  );

  // password encryption
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const { rows } = await db.query(
    'INSERT INTO users (username, name, email, phone, password, address, city, state, country, zip, gender, avatar_url, avatar_public_id, customer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *',
    [
      username,
      name,
      email,
      phone,
      hashedPassword,
      address,
      city,
      state,
      country,
      zip,
      gender,
      myCloud.secure_url,
      myCloud.public_id,
      customer_id,
    ]
  );

  // create token
  const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  sendToken(rows[0], 200, res, token);
});

// Login User
exports.loginUser = asyncErrorHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  // find user in database
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (rows.length === 0) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  const isPasswordMatched = await bcrypt.compare(password, rows[0].password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // create token
  const token = jwt.sign({ id: rows[0].user_id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  // res.status(200).json({
  //   success: true,
  //   message: 'User logged in successfully',
  //   token,
  //   data: rows[0],
  // });

  sendToken(rows[0], 200, res, token);
});

// Logout User
exports.logoutUser = asyncErrorHandler(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged Out',
  });
});

// Get User Details
exports.getUserDetails = asyncErrorHandler(async (req, res, next) => {
  const { user_id } = req.user;

  const { rows } = await db.query('SELECT * FROM users WHERE user_id = $1', [
    user_id,
  ]);

  res.status(200).json({
    success: true,
    user: rows[0],
  });
});

// Forgot Password
exports.forgotPassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler('User Not Found', 404));
  }

  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;
  const resetPasswordUrl = `https://${req.get(
    'host'
  )}/password/reset/${resetToken}`;

  // const message = `Your password reset token is : \n\n ${resetPasswordUrl}`;

  try {
    await sendEmail({
      email: user.email,
      templateId: process.env.SENDGRID_RESET_TEMPLATEID,
      data: {
        reset_url: resetPasswordUrl,
      },
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

// Reset Password
exports.resetPassword = asyncErrorHandler(async (req, res, next) => {
  // create hash token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler('Invalid reset password token', 404));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

// Update Password
exports.updatePassword = asyncErrorHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Old Password is Invalid', 400));
  }

  user.password = req.body.newPassword;
  await user.save();
  sendToken(user, 201, res);
});

// Update User Profile
exports.updateProfile = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.body.avatar !== '') {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: 'avatars',
      width: 150,
      crop: 'scale',
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: true,
  });

  res.status(200).json({
    success: true,
  });
});

// ADMIN DASHBOARD

// Get All Users --ADMIN
exports.getAllUsers = asyncErrorHandler(async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM users');

  res.status(200).json({
    success: true,
    users: rows,
  });
});

// Get Single User Details --ADMIN
exports.getSingleUser = asyncErrorHandler(async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM users WHERE user_id = $1', [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    user: rows[0],
  });
});

// Update User Role --ADMIN
exports.updateUserRole = asyncErrorHandler(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    gender: req.body.gender,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

// Delete Role --ADMIN
exports.deleteUser = asyncErrorHandler(async (req, res, next) => {
  // delete user
  const { rows } = await db.query('DELETE FROM users WHERE user_id = $1', [
    req.params.id,
  ]);

  if (rows.length === 0) {
    return next(
      new ErrorHandler(`User doesn't exist with id: ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
  });
});
