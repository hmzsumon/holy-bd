const Product = require('../models/productModel');
const asyncErrorHandler = require('../middlewares/asyncErrorHandler');
const SearchFeatures = require('../utils/searchFeatures');
const ErrorHandler = require('../utils/errorHandler');
const cloudinary = require('cloudinary');
const Services = require('../models/servicesModel');
const db = require('../config/db');

// Create Service ---ADMIN
exports.createService = asyncErrorHandler(async (req, res, next) => {
  const { name, description, unit, unitPrice, icon } = req.body;
  // cloudinary upload icon
  const result = await cloudinary.v2.uploader.upload(icon, {
    folder: 'services',
  });

  const { public_id, secure_url } = result;

  const { rows } = await db.query(
    'INSERT INTO services (name, description, unit, unitPrice, icon_url, icon_public_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
    [name, description, unit, unitPrice, secure_url, public_id]
  );

  res.status(201).json({
    success: true,
    data: rows[0],
  });
});

// Get all services
exports.getServices = asyncErrorHandler(async (req, res, next) => {
  const resPerPage = 4;
  const servicesCount = await Services.countDocuments();

  const apiFeatures = new SearchFeatures(Services.find(), req.query)
    .search()
    .filter()
    .pagination(resPerPage);

  const services = await apiFeatures.query;

  res.status(200).json({
    success: true,
    servicesCount,
    resPerPage,
    services,
  });
});

// Get Service Details
exports.getServiceDetails = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;

  const { rows } = await db.query('SELECT * FROM services WHERE id = $1', [id]);

  const service = rows[0];

  if (!service) {
    return next(new ErrorHandler('Service Not Found', 404));
  }

  res.status(200).json({
    success: true,
    service,
  });
});

// Update Service ---ADMIN
exports.updateSErvice = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  const { name, description, unit, unitPrice, icon } = req.body;

  // cloudinary upload icon
  const result = await cloudinary.v2.uploader.upload(icon, {
    folder: 'services',
  });

  const { public_id, secure_url } = result;

  // update service
  const { rows } = await db.query(
    'UPDATE services SET name = $1, description = $2, unit = $3, unitPrice = $4, icon_url = $5, icon_public_id = $6 WHERE id = $7 RETURNING *',
    [name, description, unit, unitPrice, secure_url, public_id, id]
  );

  const service = rows[0];
  res.status(201).json({
    success: true,
    service,
  });
});

// Delete service
exports.deleteService = asyncErrorHandler(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  const { rows } = await db.query('DELETE FROM services WHERE id = $1', [id]);

  // delete from cloudinary
  const service = rows[0];
  const image_id = service.icon_public_id;
  await cloudinary.v2.uploader.destroy(image_id);

  if (!service) {
    return next(new ErrorHandler('Service not found', 404));
  }

  res.status(200).json({
    success: true,
    message: 'Service is deleted.',
  });
});

// get all services ---ADMIN
exports.getAllServices = asyncErrorHandler(async (req, res, next) => {
  const { rows } = await db.query('SELECT * FROM services');

  res.status(200).json({
    success: true,
    services: rows,
    servicesCount: rows.length,
  });
});

exports.getFriends = asyncErrorHandler(async (req, res, next) => {
  const items = [
    {
      p_name: 'Apple',
      price: 100,
      quantity: 2,
    },
    {
      p_name: 'Orange',
      price: 50,
      quantity: 3,
    },
    {
      p_name: 'Banana',
      price: 20,
      quantity: 5,
    },
  ];
  // insert items into order_info table
  const { rows } = await db.query(
    'INSERT INTO order_info (name, order_items) VALUES ($1, $2) RETURNING *',
    ['John', JSON.stringify(items)]
  );

  res.status(200).json({
    success: true,
    data: rows[0],
  });
});

// get single order
exports.getSingleOrder = asyncErrorHandler(async (req, res, next) => {
  const id = 2;
  const price = 50;
  const itemsName = 'Apple';

  //update order items
  const { rows } = await db.query(
    'UPDATE order_info SET order_items = order_items || $1 WHERE id = $2 AND order_items @> $3 RETURNING *',
    [
      JSON.stringify({ p_name: 'Mango', price: 30, quantity: 2 }),
      id,
      JSON.stringify({ p_name: itemsName, price: price }),
    ]
  );

  const order = rows[0];

  if (!order) {
    return next(new ErrorHandler('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// new service_order table
exports.newServiceOrder = asyncErrorHandler(async (req, res, next) => {
  const user_id = req.user.user_id;
  const { username } = req.user;
  const { item_qty, total, address, city, zip, country, phone } = req.body;

  const { rows } = await db.query(
    'INSERT INTO service_orders (user_id, username, item_qty, total, address, city, zip, country, phone) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [user_id, username, item_qty, total, address, city, zip, country, phone]
  );

  const orderItems = req.body.orderItems;

  // insert order items to service_order_items table
  orderItems.forEach(async (item) => {
    console.log(item);
    const { rows: orderItem } = await db.query(
      'INSERT INTO service_order_items (user_id, username, service_order_id, service_id, service_name, quantity, unit_price, unit, total,icon_url, order_total ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [
        user_id,
        username,
        rows[0].id,
        item.service,
        item.name,
        item.quantity,
        item.price,
        item.unit,
        item.total,
        item.icon_url,
        total,
      ]
    );

    // console.log(orderItem);
  });

  res.status(200).json({
    success: true,
    data: rows[0],
  });
});

// get single service_order_item
exports.getSingleServiceOrderItem = asyncErrorHandler(
  async (req, res, next) => {
    const { id } = req.params;
    const { rows } = await db.query(
      'SELECT * FROM service_order_items WHERE id = $1',
      [id]
    );

    const item = rows[0];

    if (!item) {
      return next(new ErrorHandler('Item not found', 404));
    }

    res.status(200).json({
      success: true,
      service_item: item,
    });
  }
);
