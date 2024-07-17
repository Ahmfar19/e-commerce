const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();

// import controllers
const customerController = require('../controllers/customer.controller');
const categoryController = require('../controllers/category.controller');
const productController = require('../controllers/product.controller');
const orderTypeController = require('../controllers/orderType.controller');
const orderController = require('../controllers/order.controller');
const resetPassword = require('../controllers/resetPassword.controller');
const storeInformation = require('../controllers/storeInfo.controller');
const orderItemsController = require('../controllers/orderItems.controller');
const shippingController = require('../controllers/shipping.controller');
const unitController = require('../controllers/unit.controller');
const staffController = require('../controllers/staff.controller');


// users
router.post('/user/new', customerController.createUser);
router.get('/users', customerController.getUsers);
router.get('/user/:id', customerController.getSingleUser);
router.put('/user/edit/:id', customerController.updateUser);
router.delete('/user/delete/:id', customerController.deleteUser);
router.put('/user/password/:id', customerController.updateUserPassword);
router.post('/user/login', customerController.login);
router.post('/user/verifyToken', customerController.verifyToken);

// Forget password
router.post('/forgetPassword', resetPassword.forgetPassword);
// Reset Password
router.post('/resetPassword', resetPassword.resetPassword);
// pinCode for compare
router.post('/pinCode', resetPassword.checkPinCode);

// categories
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getSingleCategory);
router.post('/category/new', categoryController.createCategory);
router.put('/category/edit/:id', categoryController.updateCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

// products
router.get('/product/:id', productController.getProduct);
router.get('/products/count', productController.getProductsCount);
router.get('/products', productController.getProducts);
router.post('/product/new', upload.array('images'), productController.createProduct);
router.put('/product/edit/:id', upload.array('images'), productController.updateProduct);
router.delete('/product/delete/:id', productController.deleteProduct);
router.get('/products/pagenation', productController.getPaginatedProducts);
router.get('/products/search', productController.filterProductsByName);
router.get('/products/filter', productController.getProductsFilter);
router.get('/products/multi', productController.getMultiProducts);
router.get('/popular-products', productController.getPopularProducts);
router.get('/products/priceRange', productController.getProductsByRangePrice);
router.get('/products/random', productController.getRandomCategoryProducts);
router.get('/products/quantity', productController.getProductsByQuantity);
router.get('/products/unavailable', productController.getProductsByUnAvailable);

// orderType
router.get('/orderTypes', orderTypeController.getOrderTypes);
router.post('/orderType/new', orderTypeController.createOrderType);
router.get('/orderType/:id', orderTypeController.getSingleOrderType);
router.put('/orderType/edit/:id', orderTypeController.updateOrderType);
router.delete('/orderType/delete/:id', orderTypeController.deleteOrderType);

// orders
router.post('/order/new', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.delete('/orders/delete', orderController.deleteAllOrders);
router.get('/orders/customer/:id', orderController.getOrderByCustomerId);
router.delete('/orders/customer/delete/:id', orderController.deleteOrderByCustomerId);
router.delete('/order/delete/:id', orderController.deleteOrderById);
router.get('/order/:id', orderController.getOrderById);
router.get('/orders/type', orderController.getOrderByType);
router.put('/order/type/edit/:id', orderController.updateOrderType);
router.get('/orders/month', orderController.getOrdersInThisMonth);

// order items
router.get('/orderitems/:id', orderItemsController.getOrderItems);

// storeInfo
router.get('/storeInfo', storeInformation.getStoreInfo);
router.put('/storeInfo/edit/:id', storeInformation.updateStoreInformation);
router.delete('/storeInfo/delete/:id', storeInformation.deleteStoreInfo);
router.post('/storeInfo/new', storeInformation.createStoreInformation);

// shipping
router.post('/shipping/new', shippingController.createShipping);
router.put('/shipping/edit/:id', shippingController.updateShipping);
router.get('/shippings', shippingController.getShippings);
router.get('/shipping/:id', shippingController.getSingleShipping);
router.delete('/shipping/delete/:id', shippingController.deleteShipping);

// units
router.get('/units', unitController.getUnits);
router.post('/unit/new', unitController.createUnit);
router.get('/unit/:id', unitController.getSingleUnit);
router.put('/unit/edit/:id', unitController.updateUnit);
router.delete('/unit/delete/:id', unitController.deleteUnit);


//staff
router.post('/staff/new', staffController.createStaff);
router.get('/staffs', staffController.getstaffs);
router.get('/staff/:id', staffController.getSingleStaff);
router.put('/staff/edit/:id', staffController.updateStaff);
router.put('/staff/password/:id', staffController.updateStaffPassword);
router.delete('/staff/delete/:id', staffController.deleteStaff);
router.post('/staff/login', staffController.login);
router.post('/staff/verifyToken', staffController.verifyToken);


module.exports = router;
