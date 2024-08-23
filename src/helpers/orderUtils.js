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
        billing_address: {
            given_name: orderData.fname,
            family_name: orderData.lname,
            email: orderData.email,
            street_address: orderData.adress,
            postal_code: orderData.zip,
            city: orderData.city,
            phone: orderData.phone,
        },
        shipping_address: {
            given_name: orderData.fname,
            family_name: orderData.lname,
            email: orderData.email,
            street_address: orderData.adress,
            postal_code: orderData.zip,
            city: orderData.city,
            phone: orderData.phone,
        },
        shipping_options: [
            {
                id: orderData.shipping_id,
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
            confirmation: 'https://localhost:3000/order/confirmation?klarna_order_id={checkout.order.id}',
            push: 'https://127.0.0.1:3000/server/api/klarna/paymentrequests/status?klarna_order_id={checkout.order.id}',
        },
    };
};

const unmigrateKlarnaStruct = (data) => {
    const customer = data.billing_address;
    const order_lines = data.order_lines;
    const shipping_options = data.shipping_options[0]; // Assuming there's always at least one shipping option

    // Unmigrated customer data
    const unMigratedCustomer = {
        fname: customer.given_name,
        lname: customer.family_name,
        email: customer.email,
        adress: customer.street_address,
        zip: customer.postal_code,
        city: customer.city,
        phone: customer.phone,
    };

    // Calculate order details
    const unMigratedOrder = {
        sub_total: order_lines.reduce((acc, curr) => acc + (curr.type !== 'shipping_fee' ? curr.total_amount : 0), 0)
            / 100, // Convert back from öre to SEK
        shipping_price: shipping_options.price / 100, // Convert back from öre to SEK
        tax: order_lines.reduce((acc, curr) => acc + (curr.type !== 'shipping_fee' ? curr.total_tax_amount : 0), 0)
            / 100, // Convert back from öre to SEK
        shipping_id: shipping_options.id,
        shipping_name: shipping_options.name,
        shipping_time: shipping_options.shipping_method, // Assuming `shipping_method` is what was used for time
    };

    // Unmigrated order items using reduce
    const unmigratedOrderItems = order_lines.reduce((acc, item) => {
        if (item.type !== 'shipping_fee') {
            acc.push({
                articelNumber: item.reference,
                name: item.name,
                price: item.unit_price / 100, // Convert back from öre to SEK
                discount: item.total_discount_amount / 100, // Convert back from öre to SEK
                quantity: item.quantity,
                unit_name: item.quantity_unit,
            });
        }
        return acc;
    }, []);

    return {
        customer: unMigratedCustomer,
        order: unMigratedOrder,
        products: unmigratedOrderItems,
    };
};

module.exports = {
    sendOrderEmail,
    commitOrder,
    migrateProductsToKlarnaStructure,
    unmigrateKlarnaStruct,
};
