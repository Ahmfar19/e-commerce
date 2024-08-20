const ejs = require('ejs');
const path = require('path');
const StoreInfo = require('../models/storeInfo.model');
const OrderModel = require('../models/order.model');
const OrderItemsModel = require('../models/orderItems.model');
const { sendHtmlEmail } = require('../controllers/sendEmail.controller');

function getFirstImage(item) {
    const images = JSON.parse(item.image);
    return images[0];
}

const sendOrderEmail = async (orderData, templatePath) => {
    // Construct inline images data
    const inlineImages = orderData.products.map((product) => {
        const firstImage = JSON.parse(product.image)[0];
        const imagePath = path.resolve('public/images', `product_${product.product_id}`, firstImage);
        return {
            filename: firstImage,
            path: imagePath,
            cid: `${firstImage}`, // Unique CID
        };
    });

    orderData.products.forEach(product => {
        product.cid = getFirstImage(product);
    });

    // Get the store information to add to the email
    const [storeInfo] = await StoreInfo.getAll();
    orderData.storeInfo = storeInfo;

    const htmlTamplate = await ejs.renderFile(templatePath, { orderData, getFirstImage });
    sendHtmlEmail(orderData.email, 'hello', 'customer', htmlTamplate, inlineImages);
};

const commitOrder = async (orderId, isResend) => {
    const templatePath = path.resolve(`public/orderTamplate/index.html`);
    const products = await OrderItemsModel.getItemsByOrderId(orderId);
    if (products && products.length) {
        if (!isResend) {
            OrderModel.updateProductQuantities(products);
        }
        const [orderData] = await OrderModel.getById(orderId);
        orderData.products = products;
        sendOrderEmail(orderData, templatePath);
    }
};

module.exports = {
    sendOrderEmail,
    commitOrder,
};
