const ejs = require('ejs');
const path = require('path');
const StoreInfo = require('../models/storeInfo.model');
const OrderModel = require('../models/order.model');
const OrderItemsModel = require('../models/orderItems.model');
const { sendHtmlEmail } = require('../controllers/sendEmail.controller');
const { roundToTwoDecimals } = require('../helpers/utils');

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

const calculateVatAmount = (totalWithVat, vatRate) => {
    const res = totalWithVat * ((vatRate) / (100 + (+vatRate)));
    return roundToTwoDecimals(res);
};

const migrateProductsToKlarnaStructure = async (products, orderData) => {
    let [tax] = await StoreInfo.getTax();
    tax = tax.tax_percentage;

    const orderTaxInOres = Math.round(orderData.tax * 100); // Convert total tax to öre
    const orderTotalInOres = Math.round(orderData.sub_total * 100); // Convert total amount to öre
    const shippingPrice = Math.round(orderData.shipping_price * 100);
    const shippingInfo = orderData.shipping_name + ' 2-' + orderData.shipping_time + ' Dagar';

    return {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-SE',
        order_amount: orderTotalInOres,
        order_tax_amount: orderTaxInOres,
        shipping_options: [
            {
                id: 'express_priority',
                name: shippingInfo,
                price: shippingPrice,
                preselected: true,
                tax_amount: 0,
                tax_rate: 0,
                shipping_method: 'PickUpStore',
            },
        ],
        order_lines: products.map(product => {
            const unitPriceInOres = product.price * 100; // Convert price to öre
            const discountInOres = (product.discount || 0) * 100; // Convert discount to öre
            const discountedUnitPrice = unitPriceInOres - discountInOres; // Apply the discount

            const quantity = +product.quantity;
            const totalAmount = discountedUnitPrice * quantity; // Total amount after discount
            const totalDiscountAmount = discountInOres * quantity; // Total discount applied

            const taxRate = Math.round(tax * 100); // Tax rate as percentage * 100
            const totalTaxAmount = calculateVatAmount(totalAmount, tax);

            return {
                type: 'physical',
                reference: String(product.articelNumber),
                name: product.name,
                quantity: quantity,
                quantity_unit: product.unit_name,
                unit_price: unitPriceInOres,
                tax_rate: taxRate,
                total_amount: totalAmount,
                total_discount_amount: totalDiscountAmount,
                total_tax_amount: totalTaxAmount,
                image_url: product.image ? `https://www.exampleobjects.com/${product.image}` : '',
                product_url: `https://www.estore.com/products/${product.product_id}`,
            };
        }),
        merchant_urls: {
            terms: 'https://www.example.com/terms',
            checkout: 'https://www.example.com/checkout?klarna_order_id={checkout.order.id}',
            // confirmation: 'https://www.example.com/confirmation?klarna_order_id={checkout.order.id}',
            confirmation: 'https://127.0.0.1:3000/order/confirmation?klarna_order_id={checkout.order.id}',
            push: 'https://www.example.com/api/klarna/push?klarna_order_id={checkout.order.id}',
        },
    };
};

module.exports = {
    sendOrderEmail,
    commitOrder,
    migrateProductsToKlarnaStructure,
};
