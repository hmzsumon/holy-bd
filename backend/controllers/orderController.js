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
  console.log(user_id);

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
  const { status } = req.body;

  console.log(id, status);

  const { rows: order } = await db.query(
    'SELECT * FROM service_orders WHERE id = $1',
    [id]
  );

  if (order.length === 0) {
    return next(new ErrorHandler('Order Not Found', 404));
  }

  // console.log(order[0].order_status);

  if (order[0].order_status === 'Delivered') {
    return next(new ErrorHandler('Already Delivered', 400));
  }

  // if status = shipped, update update order_status to shipped and shipped_at to now
  if (status === 'Shipped') {
    const { rows: updatedOrder } = await db.query(
      'UPDATE service_orders SET order_status = $1, shipped_at = $2 WHERE id = $3 RETURNING *',
      [status, new Date(), id]
    );
  }

  // if status = delivered, update update order_status to delivered and delivered_at to now and bill_start_at to now

  if (status === 'Delivered') {
    const { rows: updatedOrder } = await db.query(
      'UPDATE service_orders SET order_status = $1, delivered_at = $2, bill_start_at = $3 WHERE id = $4 RETURNING *',
      [status, new Date(), new Date(), id]
    );
  }

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

// update orderItems
exports.updateServiceOrderItem = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { discount, quantity, total, order_total, order_discount } = req.body;

  console.log(req.body);

  // find service_order_items by id
  const { rows: orderItems } = await db.query(
    'SELECT * FROM service_order_items WHERE id = $1',
    [id]
  );

  // update service_order_items total && discount
  const { rows } = await db.query(
    'UPDATE service_order_items SET total = $1, discount = $2,  quantity = $3, order_total = $4, order_discount = $5 WHERE id = $6 RETURNING *',
    [total, discount, quantity, order_total, order_discount, id]
  );

  // update service_orders total
  const { rows: order } = await db.query(
    'SELECT * FROM service_orders WHERE id = $1',
    [orderItems[0].service_order_id]
  );

  // console.log(orderDiscount);

  // console.log(orderTotal, orderDiscount);

  // update order total
  await db.query(
    'UPDATE service_orders SET total = $1, discount = $2 WHERE id = $3 RETURNING *',
    [order_total, order_discount, orderItems[0].service_order_id]
  );

  // update all service_order_items order_total && order_discount
  await db.query(
    'UPDATE service_order_items SET order_total = $1, order_discount = $2 WHERE service_order_id = $3 RETURNING *',
    [order_total, order_discount, orderItems[0].service_order_id]
  );

  res.status(200).json({
    success: true,
  });
});
