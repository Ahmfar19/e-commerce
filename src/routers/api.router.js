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

// users
router.post('/user/new', customerController.createUser);
router.get('/users', customerController.getUsers);
router.get('/user/:id', customerController.getSingleUser);
router.put('/user/edit/:id', customerController.updateUser);
router.delete('/user/delete/:id', customerController.deleteUser);
router.put('/user/password/:id', customerController.updateUserPassword);

// categories
router.get('/categories', categoryController.getCategories);
router.get('/category/:id', categoryController.getSingleCategory);
router.post('/category/new', categoryController.createCategory);
router.put('/category/edit/:id', categoryController.updateCategory);
router.delete('/category/delete/:id', categoryController.deleteCategory);

// products
router.get('/product/:id', productController.getProduct);
router.get('/products', productController.getProducts);
router.post('/product/new', upload.array('images'), productController.createProduct);
router.put('/product/edit/:id', upload.array('images'), productController.updateProduct);
router.delete('/product/delete/:id', productController.deleteProduct);
router.get('/products/:categoryId', productController.getProductByCategoryId)

//orderType
router.get('/orderTypes', orderTypeController.getOrderTypes)
router.post('/orderType/new', orderTypeController.createOrderType)
router.get('/orderType/:id', orderTypeController.getSingleOrderType)
router.put('/orderType/edit/:id', orderTypeController.updateOrderType)
router.delete('/orderType/delete/:id', orderTypeController.deleteOrderType)

//orders
router.post('/order/new', orderController.createOrder)
router.get('/orders', orderController.getAllOrders)
module.exports = router;
