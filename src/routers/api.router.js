const express = require('express');
const router = express.Router();
const { initSIDSession, isAuthenticated } = require('../authentication');

// import controllers
const customerController = require('../controllers/customer.controller');
const categoryController = require('../controllers/category.controller');
const productController = require('../controllers/product.controller');
const orderController = require('../controllers/order.controller');
const resetPassword = require('../controllers/resetPassword.controller');
const storeInformation = require('../controllers/storeInfo.controller');
const orderItemsController = require('../controllers/orderItems.controller');
const shippingController = require('../controllers/shipping.controller');
const unitController = require('../controllers/unit.controller');
const topProductController = require('../controllers/topProducts.controller');
const orderTypeController = require('../controllers/orderType.controller');
const swishController = require('../controllers/swish.controller');
const klarnaController = require('../controllers/klarna.controller');

// Payments
router.post('/swish/paymentrequests', swishController.swish_paymentrequests);
router.post('/swish/paymentrequests/status', swishController.receivePaymentStatus);
router.get('/swish/paymentrequests/:requestId', swishController.getPaymentrequests);

router.post('/klarna/paymentrequests', klarnaController.klarna_paymentrequests);
router.get('/klarna/paymentrequests/status', klarnaController.getOrderStatus);
router.get('/klarna/paymentrequests/push', klarnaController.reportOrderStatus);

// Authentication
router.post('/auth/customer/verifyToken', customerController.verifyToken);
router.post('/auth/initSIDSession', initSIDSession); // Middleware to initialize user session

// customers
router.post('/customers/new', customerController.createUser);
router.get('/customer/:id', customerController.getSingleUser);
router.put('/customer/edit/:id', customerController.updateUser);
router.put('/customer/password/:id', customerController.updateUserPassword);
router.post('/customer/login', customerController.login);
router.post('/customer/logout', isAuthenticated, customerController.logout);

// Customer reset password
router.post('/forgetPassword', resetPassword.forgetPassword);
router.post('/resetPassword', resetPassword.resetPassword);
router.post('/pinCode', resetPassword.checkPinCode);

// categories
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getSingleCategory);

// products
router.get('/product/:id', productController.getProduct);
router.get('/products/count', productController.getProductsCount);
router.get('/products', productController.getProducts);
router.get('/products/pagenation', productController.getPaginatedProducts);
router.get('/products/search', productController.filterProductsByName);
router.get('/products/filter', productController.getProductsFilter);
router.get('/products/multi', productController.getMultiProducts);
router.get('/popular-products', productController.getPopularProducts);
router.get('/products/priceRange', productController.getProductsByRangePrice);
router.get('/products/random', productController.getRandomCategoryProducts);
router.post('/products/checkQuantities', productController.checkQuantitiesForCheckout);

// Top products
router.get('/top-products', topProductController.getTopProducts);
router.get('/custom-top-products', topProductController.getCustomTopProducts);
router.get('/top-products/:id', topProductController.getTopProduct);

// orders
router.post('/order/new', orderController.createOrder);
router.get('/orders/customer/:id', orderController.getOrderByCustomerId);

// OrderType
router.get('/orderTypes', orderTypeController.getOrderTypes);

// order items
router.get('/orderitems/:id', orderItemsController.getOrderItems);

// storeInfo
router.get('/storeInfo', storeInformation.getStoreInfo);

// shipping
router.get('/shippings', shippingController.getShippings);
router.get('/shipping/:id', shippingController.getSingleShipping);

// units
router.get('/units', unitController.getUnits);

module.exports = router;
