const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');
const StoreInfo = require('../models/storeInfo.model');
const OrderModel = require('../models/order.model');
const OrderItemsModel = require('../models/orderItems.model');
const { sendHtmlEmail } = require('../controllers/sendEmail.controller');
const { roundToTwoDecimals } = require('../helpers/utils');
const config = require('config');

const PRODUCTS_IMAGE_URL = config.get('PRODUCTS_IMAGE_URL');
const PRODUCTS_URL = config.get('PRODUCTS_URL');
const CHECKOUT_URL = config.get('CHECKOUT_URL');
const KLARNA_CALLBACK = config.get('KLARNA_CALLBACK');
const KLARNA_CONFIRMATION = config.get('KLARNA_CONFIRMATION');

function getFirstImage(item) {
    try {
        const images = JSON.parse(item.image);
        if (!images?.length) {
            return 'no-product-image-available.png';
        }
        return images[0];
    } catch {
        return 'no-product-image-available.png';
    }
}

const sendOrderEmail = async (orderData, templatePath) => {
    const defaultImagePath = path.resolve('public/image', 'no-product-image-available.png');

    // Helper function to get the correct image path
    const getImagePath = async (product, firstImage) => {
        const imagePath = path.resolve('public/images', `product_${product.product_id}`, firstImage);
        try {
            // Check if the image file exists
            await fs.access(imagePath);
            return imagePath;
        } catch (err) {
            // If the image doesn't exist, return the default image path
            return defaultImagePath;
        }
    };

    // Construct inline images data
    const inlineImages = await Promise.all(orderData.products.map(async (product) => {
        let firstImage;
        let imagePath;

        const fallBack = () => {
            firstImage = 'no-product-image-available.png';
            imagePath = path.resolve('public/image', 'no-product-image-available.png');
        };

        try {
            // Check if product.image exists and is a non-empty string
            if (product?.image && typeof product.image === 'string' && product.image.trim() !== '') {
                // Try to parse the image string as JSON
                const imageArray = JSON.parse(product.image);
                if (Array.isArray(imageArray) && imageArray.length > 0) {
                    firstImage = imageArray[0];
                    imagePath = await getImagePath(product, firstImage);
                } else {
                    fallBack();
                }
            }
        } catch {
            fallBack();
        }

        return {
            filename: firstImage,
            path: imagePath,
            cid: `${firstImage}`, // Unique CID
        };
    }));

    orderData.products.forEach(product => {
        product.cid = getFirstImage(product);
    });

    // Get the store information to add to the email
    const [storeInfo] = await StoreInfo.getAll();
    orderData.storeInfo = storeInfo;

    const htmlTemplate = await ejs.renderFile(templatePath, { orderData, getFirstImage });
    sendHtmlEmail(orderData.email, 'Orderbekräftelse', '', htmlTemplate, inlineImages);
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
            street_address: orderData.address,
            postal_code: orderData.zip,
            city: orderData.city,
            phone: orderData.phone,
            merchant_data: JSON.stringify({
                customer_id: orderData.customer_id,
            }),
        },
        shipping_address: {
            given_name: orderData.fname,
            family_name: orderData.lname,
            email: orderData.email,
            street_address: orderData.address,
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
        merchant_data: JSON.stringify({
            customer_id: orderData.customer_id,
            tax: tax
        }),
        order_lines: products.map(product => {
            let discountInOres = (product.discount || 0) * 100;
            let productPriceInOres = product.price * 100;

            let quantityInKg = product.quantity;
            let unit_name = product.unit_name;

            // Calculate unit price in öre before discount
            let unitPriceInOres = productPriceInOres;

            // If the product is measured in grams rather than kilograms
            if (product.weight !== 1) {
                unitPriceInOres = unitPriceInOres / 1000;
                discountInOres = discountInOres / 1000;
                quantityInKg = quantityInKg * 1000;
                unit_name = 'g';
            }

            const totalAmountAfterDiscount = (unitPriceInOres - discountInOres) * quantityInKg;

            // Calculate tax rate and total tax amount
            const taxRate = Math.round(tax * 100); // Tax rate as percentage * 100
            const totalTaxAmount = calculateVatAmount(totalAmountAfterDiscount, tax);
            const totalDiscountAmount = discountInOres * quantityInKg;

            // Process the product image URL
            let productImage = product.image;
            if (productImage) {
                productImage = JSON.parse(productImage);
                productImage = productImage[0];
                productImage = `${PRODUCTS_IMAGE_URL}${product.product_id}/${productImage}`;
            }

            return {
                type: 'physical',
                reference: String(product.product_id),
                name: product.name,
                quantity: quantityInKg, // Quantity in kilograms or grams
                quantity_unit: unit_name, // Unit of measurement (kg or g)
                unit_price: unitPriceInOres, // Unit price in öre
                tax_rate: taxRate, // Tax rate as a percentage * 100
                total_amount: totalAmountAfterDiscount, // Total amount after discount in öre
                total_discount_amount: totalDiscountAmount, // Total discount in öre
                total_tax_amount: totalTaxAmount, // Total tax amount in öre
                image_url: productImage ? productImage : '', // Product image URL
                product_url: `${PRODUCTS_URL}${product.product_id}`, // Product URL
                merchant_data: JSON.stringify({ articelNumber: product.articelNumber }), // Merchant data
            };
        }),
        merchant_urls: {
            terms: 'https://www.example.com/terms',
            checkout: CHECKOUT_URL,
            confirmation: `${KLARNA_CONFIRMATION}?klarna_order_id={checkout.order.id}`,
            push: KLARNA_CALLBACK,
        },
    };
};

const unmigrateKlarnaStruct = async (data) => {
    const customer = data.billing_address;
    const order_lines = data.order_lines;
    const shipping_options = data.selected_shipping_option;
    const merchantData = JSON.parse(data.merchant_data || {});

    let storeTax = merchantData.tax;
    if (!storeTax) {
        let [tax] = await StoreInfo.getTax();
        storeTax = tax.tax_percentage;
    }

    // Unmigrated customer data
    const unMigratedCustomer = {
        customer_id: merchantData.customer_id,
        fname: customer.given_name,
        lname: customer.family_name,
        email: customer.email,
        address: customer.street_address,
        zip: customer.postal_code,
        city: customer.city,
        phone: customer.phone,
    };

    let total_discount = 0;
    // Unmigrated order items using reduce
    const unmigratedOrderItems = order_lines.reduce((acc, item) => {
        if (item.type !== 'shipping_fee') {
            let unitPrice = item.unit_price / 100; // Convert from öre to SEK
            let totalDiscount = item.total_discount_amount / 100; // Convert from öre to SEK
            let quantity = item.quantity;
            let merchantData = item.merchant_data;
            let unitname = item.quantity_unit;

            // Sum the order_lines total discount
            total_discount += totalDiscount

            // Calculate discount per unit
            let discountPerUnit = totalDiscount / quantity;

            // Handle cases where the weight was originally in grams (g)
            if (item.quantity_unit === 'g') {
                unitPrice = unitPrice * 1000; // Convert price from per gram to per kilogram
                discountPerUnit = discountPerUnit * 1000; // Convert discount from per gram to per kilogram
                unitname = 'kg';
                quantity = quantity / 1000; // Convert quantity from grams to kilograms
            }

            if (typeof merchantData === 'string') {
                try {
                    merchantData = JSON.parse(merchantData);
                } catch (error) {
                    merchantData = {};
                }
            }
            const articelNumber = merchantData?.articelNumber || 0;

            // Handle image URL transformation
            if (item.image_url) {
                const parts = item.image_url.split('/');
                const fileName = parts[parts.length - 1];
                item.image_url = JSON.stringify([fileName || '']) || '[]';
            }

            acc.push({
                product_id: +item.reference,
                name: item.name,
                articelNumber: articelNumber,
                price: unitPrice,
                unit_name: unitname,
                discount: discountPerUnit, // Use the calculated discount per unit
                image: item.image_url || '[]',
                quantity: quantity,
            });
        }
        return acc;
    }, []);

    let order_date = new Date(data.created_at);
    order_date = order_date.toLocaleString();

    const sub_total = (data.order_amount / 100) - ((shipping_options.price / 100) || 0)

    // Calculate order details
    const unMigratedOrder = {
        customer_id: merchantData.customer_id,
        type_id: 1,
        date: order_date,
        shipping_price: shipping_options.price / 100,
        address: customer.street_address,
        zip: customer.postal_code,
        city: customer.city,
        sub_total: sub_total,
        tax: calculateVatAmount(sub_total, storeTax),
        items_discount: total_discount,
        total: data.order_amount / 100,
    };

    return {
        customer: unMigratedCustomer,
        order: unMigratedOrder,
        products: unmigratedOrderItems,
        shipping_id: shipping_options.id,
        klarna_order_id: data.order_id,
        klarna_reference: data.klarna_reference,
    };
};

module.exports = {
    sendOrderEmail,
    commitOrder,
    migrateProductsToKlarnaStructure,
    unmigrateKlarnaStruct,
};
