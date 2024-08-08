const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const path = require('path');

// import controllers
const customerController = require('../controllers/customer.controller');
const resetStaffPassword = require('../controllers/resetStaffPassword.controller');
const categoryController = require('../controllers/category.controller');
const productController = require('../controllers/product.controller');
const staffController = require('../controllers/staff.controller');
const orderController = require('../controllers/order.controller');
const storeInformation = require('../controllers/storeInfo.controller');
const unitController = require('../controllers/unit.controller');
const topProductController = require('../controllers/topProducts.controller');
const orderTypeController = require('../controllers/orderType.controller');
const shippingController = require('../controllers/shipping.controller');
const discountsController = require('../controllers/discounts.controller');

const uploadUser = multer({
    dest: path.join(__dirname, 'public/users'),
    limits: {
        fileSize: 300 * 1024 * 1024, // Set the maximum file size limit in megabytes (MB)
        fieldSize: 300 * 1024 * 1024, // Set the maximum field size limit in megabytes (MB)
    },
});

// Customers
router.get('/customers', customerController.getUsers);
router.get('/customers/count', customerController.getCustomersCount);
router.delete('/customer/delete/:id', customerController.deleteUser);
router.get('/customers/filter', customerController.getCustomersFilter);

// Orders
router.delete('/orders/delete', orderController.deleteAllOrders);
router.delete('/orders/customer/delete/:id', orderController.deleteOrderByCustomerId);
router.delete('/order/delete/:id', orderController.deleteOrderById);
router.put('/order/type/edit/:id', orderController.updateOrderType);
router.get('/order/:id', orderController.getOrderById);
router.get('/orders/type', orderController.getOrderByType);
router.get('/orders/byMonth', orderController.getOrdersByMonth);
router.get('/orders/total-price/count', orderController.getOrdersTotalPriceAndCount);
router.get('/orders/total-price/count/chart', orderController.getOrdersTotalPriceForChart);
router.get('/orders/filter', orderController.getOrdersFilter);
router.get('/orders', orderController.getAllOrders);

// OrderType
router.get('/orderType/:id', orderTypeController.getSingleOrderType);
router.put('/orderType/edit/:id', orderTypeController.updateOrderType);
router.delete('/orderType/delete/:id', orderTypeController.deleteOrderType);
router.post('/orderType/new', orderTypeController.createOrderType);

// Staff
router.post('/staff/forgetPassword', resetStaffPassword.forgetPassword);
router.post('/staff/resetPassword', resetStaffPassword.resetPassword);
router.post('/staff/pinCode', resetStaffPassword.checkPinCode);

// Categories
router.post('/category/new', categoryController.createCategory);
router.put('/category/edit/:id', categoryController.updateCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

// Products
router.delete('/product/delete/:id', productController.deleteProduct);
router.post('/product/new', upload.array('images'), productController.createProduct);
router.put('/product/edit/:id', upload.array('images'), productController.updateProduct);
router.get('/products/multi-filter', productController.getProductsMultiFilter);
router.get('/products/specificForTopProduct', productController.getSpecificForTopProduct);
router.get('/products/quantity', productController.getProductsByQuantity);
router.get('/products/unavailable', productController.getProductsByUnAvailable);
router.get('/products/specificForDiscount', productController.getSpecificForDiscount);
router.get('/products/discountId/:id', productController.getProductsByDiscountId);
router.get('/productCount/category', productController.getProductsCountByCategory);
router.put('/product/discountId/productId/edit/:id', productController.updateDiscountId)


// Top products
router.put('/top-products/:id', topProductController.updateTopProduct);
router.delete('/top-products/delete/:id', topProductController.deleteTopProduct);
router.post('/top-products/new', topProductController.createTopProduct);

// Staff
router.post('/staff/new', staffController.createStaff);
router.get('/staffs', staffController.getstaffs);
router.get('/staff/:id', staffController.getSingleStaff);
router.put('/staff/edit/:id', uploadUser.single('image'), staffController.updateStaff);
router.put('/staff/password/:id', staffController.updateStaffPassword);
router.delete('/staff/delete/:id', staffController.deleteStaff);
router.post('/staff/login', staffController.login);
router.post('/staff/logout', staffController.logout);
router.post('/staff/verifyToken', staffController.verifyToken);
router.get('/staff/image/:filename', staffController.getUsersImage);

// StoreInfo
router.put('/storeInfo/edit/:id', storeInformation.updateStoreInformation);
router.delete('/storeInfo/delete/:id', storeInformation.deleteStoreInfo);
router.post('/storeInfo/new', storeInformation.createStoreInformation);

// Shipping
router.post('/shipping/new', shippingController.createShipping);
router.put('/shipping/edit/:id', shippingController.updateShipping);
router.delete('/shipping/delete/:id', shippingController.deleteShipping);

// Units
router.post('/unit/new', unitController.createUnit);
router.get('/unit/:id', unitController.getSingleUnit);
router.put('/unit/edit/:id', unitController.updateUnit);
router.delete('/unit/delete/:id', unitController.deleteUnit);

// Discounts
router.get('/discounts', discountsController.getDiscounts);
router.post('/discount/new', discountsController.createDiscount);
router.get('/discount/:id', discountsController.getSingleDiscount);
router.put('/discount/edit/:id', discountsController.updateDiscount);
router.delete('/discount/delete/:id', discountsController.deleteDiscount);

module.exports = router;
