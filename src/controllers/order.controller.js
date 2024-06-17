const Order = require('../models/order.model');
const User = require('../models/customer.model');
const { sendResponse } = require('../helpers/apiResponse');
const { hashPassword } = require('../helpers/utils');

const createOrder = async (req, res) => {
    try {
        const {
            username, first_name, last_name,
            email, password, address,
            phone, personal_number, registered,
            type_id, order_date,
            sub_total, tax, items_discount, shipping,
            total
        } = req.body;

        // Check if the user exists in the database
        const checkCustomer = await Order.checkCustomerIfExisted(email)
        if (checkCustomer.length) {
            // User exists, use their existing customer_id
            const order = new Order({
                customer_id: checkCustomer[0].customer_id,
                type_id,
                order_date,
                sub_total,
                tax,
                items_discount,
                shipping,
                total
            });

            await order.save();
            return sendResponse(res, 201, 'Created', 'Successfully created a order.', null, order);
        } else {
            // User does not exist, create a new customer and then create the order
            const hashedPassword = await hashPassword(password);

            if (!hashedPassword.success) {
                return res.json({
                    error: hashedPassword.error,
                });
            }
            const customer = new User({
                username,
                first_name,
                last_name,
                email,
                password: hashedPassword.data,
                address,
                phone,
                personal_number,
                registered
            });

            const last_customer_id = await customer.createUser();
            
            const order = new Order({
                customer_id: last_customer_id,
                type_id,
                order_date,
                sub_total,
                tax,
                items_discount,
                shipping,
                total
            });

            await order.save();
            return sendResponse(res, 201, 'Created', 'Successfully created a order.', null, order);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};


module.exports = {
    createOrder
};
