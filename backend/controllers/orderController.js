const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const ErrorHandler = require('../utils/errorHandler');
const sendEmail = require('../utils/sendEmail');
const db = require('../config/db');

// Create New Order
exports.newOrder = asyncErrorHandler(async (req, res, next) => {
  const user_id = req.user.user_id;
  const { item_qty, total, address, city, state, zip, country, phone } =
    req.body;

  // check if user has already placed an order
  const { rows: orderExist } = await db.query(
    'SELECT * FROM service_orders WHERE user_id = $1 AND status = $2',
    [user_id, 'pending']
  );

  if (orderExist) {
    return next(new ErrorHandler('Order Already Placed', 400));
  }

  const { rows } = await db.query(
    'INSERT INTO service_orders (user_id, item_qty, total, address, city, state, zip, country, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [user_id, item_qty, total, address, city, state, zip, country, phone]
  );

  const orderItems = req.body.orderItems;

  // insert order items to service_order_items table
  orderItems.forEach(async (item) => {
    // console.log(item);
    const { rows: orderItem } = await db.query(
      'INSERT INTO service_order_items (service_order_id, service_id, service_name, quantity, unit_price, unit, total, icon_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [
        rows[0].id,
        item.service,
        item.name,
        item.quantity,
        item.price,
        item.unit,
        item.total,
        item.icon_url,
      ]
    );

    // console.log(orderItem);
  });

  //   await sendEmail({
  //     email: req.user.email,
  //     templateId: process.env.SENDGRID_ORDER_TEMPLATEID,
  //     data: {
  //       name: req.user.name,
  //       shippingInfo,
  //       orderItems,
  //       totalPrice,
  //       oid: order._id,
  //     },
  //   });

  res.status(201).json({
    success: true,
    order: rows[0],
  });
});

// Get Single Order Details
exports.getSingleOrderDetails = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { rows: order } = await db.query(
    'SELECT * FROM service_orders WHERE id = $1',
    [id]
  );

  if (order.length === 0) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  const { rows: orderItems } = await db.query(
    'SELECT * FROM service_order_items WHERE service_order_id = $1',
    [id]
  );

  res.status(200).json({
    success: true,
    order: order[0],
    orderItems,
  });
});

// Get Logged In User Orders
exports.myOrders = asyncErrorHandler(async (req, res, next) => {
  const user_id = req.user.user_id;

  const { rows: orders } = await db.query(
    'SELECT * FROM service_orders WHERE user_id = $1',
    [user_id]
  );

  if (!orders) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  const { rows: orderItems } = await db.query(
    'SELECT * FROM service_order_items WHERE service_order_id = $1',
    [orders[0].id]
  );

  res.status(200).json({
    success: true,
    orders,
    orderItems,
  });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { rows: orders } = await db.query('SELECT * FROM service_orders');

  if (!orders) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  const { rows: orderItems } = await db.query(
    'SELECT * FROM service_order_items'
  );

  res.status(200).json({
    success: true,
    orders,
    orderItems,
  });
});

// Update Order Status ---ADMIN
exports.updateOrder = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const { rows: order } = await db.query(
    'SELECT * FROM service_orders WHERE id = $1',
    [id]
  );

  if (!order) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  if (order.orderStatus === 'Delivered') {
    return next(new ErrorHandler('Already Delivered', 400));
  }

  if (req.body.status === 'Shipped') {
    order.shippedAt = Date.now();
    order.orderItems.forEach(async (i) => {
      await updateStock(i.product, i.quantity);
    });
  }

  order.orderStatus = req.body.status;
  if (req.body.status === 'Delivered') {
    order.deliveredAt = Date.now();
  }

  await order.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete Order ---ADMIN
exports.deleteOrder = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const { rows: order } = await db.query(
    'SELECT * FROM service_orders WHERE id = $1',
    [id]
  );

  if (!order) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  res.status(200).json({
    success: true,
  });
});

// Get All Orders ---ADMIN
exports.getAllOrders = asyncErrorHandler(async (req, res, next) => {
  const { rows: orders } = await db.query('SELECT * FROM service_orders');

  if (!orders) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  const { rows: orderItems } = await db.query(
    'SELECT * FROM service_order_items'
  );

  res.status(200).json({
    success: true,
    orders,
    orderItems,
  });
});
