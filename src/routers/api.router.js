const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer();
const path = require('path');

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
const resetStaffPassword = require('../controllers/resetStaffPassword.controller');
const topProductController = require('../controllers/topProducts.controller');
const discountsController = require('../controllers/discounts.controller');

const uploadUser = multer({
    dest: path.join(__dirname, 'public/users'),
    limits: {
        fileSize: 300 * 1024 * 1024, // Set the maximum file size limit in megabytes (MB)
        fieldSize: 300 * 1024 * 1024, // Set the maximum field size limit in megabytes (MB)
    },
});

// customers
router.post('/customers/new', customerController.createUser);
router.get('/customers', customerController.getUsers);
router.get('/customers/count', customerController.getCustomersCount);
router.get('/customer/:id', customerController.getSingleUser);
router.put('/customer/edit/:id', customerController.updateUser);
router.delete('/customer/delete/:id', customerController.deleteUser);
router.put('/customer/password/:id', customerController.updateUserPassword);
router.post('/customer/login', customerController.login);
router.post('/customer/verifyToken', customerController.verifyToken);
router.get('/customers/filter', customerController.getCustomersFilter);

// Customer reset password
router.post('/forgetPassword', resetPassword.forgetPassword);
router.post('/resetPassword', resetPassword.resetPassword);
router.post('/pinCode', resetPassword.checkPinCode);

// Staff
router.post('/staff/forgetPassword', resetStaffPassword.forgetPassword);
router.post('/staff/resetPassword', resetStaffPassword.resetPassword);
router.post('/staff/pinCode', resetStaffPassword.checkPinCode);

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
router.get('/products/multi-filter', productController.getProductsMultiFilter);
router.get('/products/specificForTopProduct', productController.getSpecificForTopProduct);
router.get('/products/specificForDiscount', productController.getSpecificForDiscount);


// Top products
router.post('/top-products/new', topProductController.createTopProduct);
router.get('/top-products', topProductController.getTopProducts);
router.get('/custom-top-products', topProductController.getCustomTopProducts);
router.get('/top-products/:id', topProductController.getTopProduct);
router.put('/top-products/:id', topProductController.updateTopProduct);
router.delete('/top-products/:id', topProductController.deleteTopProduct);

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
router.get('/orders/byMonth', orderController.getOrdersByMonth);
router.get('/orders/total-price/count', orderController.getOrdersTotalPriceAndCount);
router.get('/orders/filter', orderController.getOrdersFilter);

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

// staff
router.post('/staff/new', staffController.createStaff);
router.get('/staffs', staffController.getstaffs);
router.get('/staff/:id', staffController.getSingleStaff);
router.put('/staff/edit/:id', uploadUser.single('image'), staffController.updateStaff);
router.put('/staff/password/:id', staffController.updateStaffPassword);
router.delete('/staff/delete/:id', staffController.deleteStaff);
router.post('/staff/login', staffController.login);
router.post('/staff/verifyToken', staffController.verifyToken);
router.get('/staff/image/:filename', staffController.getUsersImage);

// discounts
router.get('/discounts', discountsController.getDiscounts);
router.post('/discount/new', discountsController.createDiscount);
router.get('/discount/:id', discountsController.getSingleDiscount);
router.put('/discount/edit/:id', discountsController.updateDiscount);
router.delete('/discount/delete/:id', discountsController.deleteDiscount);

module.exports = router;
