const express = require('express');

const {
  createService,
  getAllServices,
  getServiceDetails,
  updateSErvice,
  deleteService,
  newServiceOrder,
} = require('../controllers/serviceController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

// create new service
router
  .route('/services/new')
  .post(isAuthenticatedUser, authorizeRoles('admin'), createService);

// get Service details
router.route('/services/:id').get(getServiceDetails);

// get all services
router.route('/services').get(getAllServices);

// update service
router
  .route('/admin/services/:id')
  .put(isAuthenticatedUser, authorizeRoles('admin'), updateSErvice);

// delete service
router
  .route('/admin/services/:id')
  .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteService);

// new service order
router
  .route('/new/service/order')
  .post(isAuthenticatedUser, authorizeRoles('user'), newServiceOrder);

module.exports = router;
