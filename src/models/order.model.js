const { pool, sequelize } = require('../databases/mysql.db');
const Joi = require('joi');

const orderSchema = Joi.object({
    customer_id: Joi.number().integer().required().messages({
        'number.base': 'customer_id must be a number.',
        'number.integer': 'customer_id must be an integer.',
        'any.required': 'customer_id is required.',
    }),
    type_id: Joi.number().integer().required().messages({
        'number.base': 'type_id must be a number.',
        'number.integer': 'type_id must be an integer.',
        'any.required': 'type_id is required.',
    }),
    shipping_name: Joi.string().min(1).max(255).required().messages({
        'string.base': 'shipping_name must be a string.',
        'string.empty': 'shipping_name cannot be empty.',
        'any.required': 'shipping_name is required.',
    }),
    shipping_price: Joi.number().precision(2).required().messages({
        'number.base': 'shipping_price must be a number.',
        'number.precision': 'shipping_price must have up to two decimal places.',
        'any.required': 'shipping_price is required.',
    }),
    shipping_time: Joi.number().integer().min(1).required().messages({
        'number.base': 'shipping_time must be a number.',
        'number.integer': 'shipping_time must be an integer.',
        'number.min': 'shipping_time must be at least 1.',
        'any.required': 'shipping_time is required.',
    }),
    sub_total: Joi.number().precision(2).required().messages({
        'number.base': 'sub_total must be a number.',
        'number.precision': 'sub_total must have up to two decimal places.',
        'any.required': 'sub_total is required.',
    }),
    address: Joi.string().min(1).max(255).required().messages({
        'string.base': 'address must be a string.',
        'string.empty': 'address cannot be empty.',
        'any.required': 'address is required.',
    }),
    zip: Joi.string().required().messages({
        'string.base': 'zip must be a string.',
        'any.required': 'zip is required.',
    }),
    city: Joi.string().min(1).max(100).required().messages({
        'string.base': 'city must be a string.',
        'string.empty': 'city cannot be empty.',
        'any.required': 'city is required.',
    }),
    tax: Joi.number().precision(2).required().messages({
        'number.base': 'tax must be a number.',
        'number.precision': 'tax must have up to two decimal places.',
        'any.required': 'tax is required.',
    }),
    items_discount: Joi.number().precision(2).optional().default(0).messages({
        'number.base': 'items_discount must be a number.',
        'number.precision': 'items_discount must have up to two decimal places.',
    }),
    total: Joi.number().precision(2).required().messages({
        'number.base': 'total must be a number.',
        'number.precision': 'total must have up to two decimal places.',
        'any.required': 'total is required.',
    }),
    trackingNumber: Joi.string().optional().allow(null, '').messages({
        'string.base': 'trackingNumber must be a string.',
    }),
});
class Order {
    constructor(options) {
        const { error, value } = orderSchema.validate(options);
        if (error) {
            throw new Error(`${error.details.map(err => err.message).join(', ')}`);
        }
        this.customer_id = value.customer_id;
        this.type_id = value.type_id;
        this.shipping_name = value.shipping_name;
        this.shipping_price = value.shipping_price;
        this.shipping_time = value.shipping_time;
        this.sub_total = value.sub_total;
        this.address = value.address;
        this.zip = value.zip;
        this.city = value.city;
        this.tax = value.tax;
        this.items_discount = value.items_discount;
        this.total = value.total;
        this.trackingNumber = value.trackingNumber || null;
    }

    async save(transaction) {
        const sql = `INSERT INTO orders (
            customer_id,
            type_id,
            order_date,
            shipping_name,
            shipping_price,
            shipping_time,
            address,
            zip,
            city,
            sub_total,
            tax,
            items_discount,
            total,
            trackingNumber
        ) VALUES (
            ${this.customer_id},
            ${this.type_id},
            NOW(),
            "${this.shipping_name}",
            ${this.shipping_price},
            ${this.shipping_time},
            "${this.address}",
            "${this.zip}",
            "${this.city}",
            ${this.sub_total},
            ${this.tax},
            ${this.items_discount},
            ${this.total},
            "${this.trackingNumber}"
        )`;
        const result = transaction ? await sequelize.query(sql, { transaction }) : await pool.execute(sql);
        if (transaction) {
            // For MySQL, `result` is an array: [rows, metadata]
            this.order_id = result[0]; // Adjust based on Sequelize version
        } else {
            // MySQL pool's result structure: [rows, fields]
            this.order_id = result[0].insertId;
        }
        return this.order_id;
    }

    static async getAll() {
        const sql = `
            SELECT 
                orders.*,
                CONCAT(customers.fname, ' ', customers.lname) AS customerName,
                customers.email,
                customers.phone,
                customers.registered,
                customers.isCompany,
                order_type.type_name,
                DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders 
                INNER JOIN customers ON orders.customer_id = customers.customer_id
                INNER JOIN order_type ON orders.type_id = order_type.type_id
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteAll() {
        const sql = `DELETE FROM orders`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByCustomerId(customer_id) {
        const sql = `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date 
        FROM  orders where customer_id = ?`;
        const [rows] = await pool.execute(sql, [customer_id]);
        return rows;
    }

    static async deleteOrderByCustomerId(customer_id) {
        const sql = `DELETE FROM orders where customer_id = ?`;
        const [rows] = await pool.execute(sql, [customer_id]);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM orders where order_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT 
            orders.*,
            customers.customer_id,
            customers.fname,
            customers.lname,
            customers.email,
            customers.phone,
            customers.registered,
            customers.isCompany,
            order_type.type_name,
            payments.payment_type_id,
            payments.payment_id,
            DATE_FORMAT(orders.order_date, '%Y-%m-%d %H:%i:%s') AS order_date
        FROM orders 
        INNER JOIN customers ON orders.customer_id = customers.customer_id
        INNER JOIN order_type ON orders.type_id = order_type.type_id
        INNER JOIN payments ON payments.order_id = orders.order_id
        WHERE orders.order_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async updateProductQuantities(products) {
        try {
            for (const product of products) {
                const updateQuantitySql = `
                    UPDATE products
                    SET quantity = quantity - ?
                    WHERE product_id = ?
                `;
                await pool.execute(updateQuantitySql, [
                    product.quantity,
                    product.product_id,
                ]);

                const checkQuantitySql = `
                    SELECT quantity
                    FROM products
                    WHERE product_id = ?
                `;
                const [rows] = await pool.execute(checkQuantitySql, [product.product_id]);

                if (parseInt(rows[0].quantity) === 0) {
                    const updateAvailabilitySql = `
                        UPDATE products
                        SET available = false
                        WHERE product_id = ?
                    `;
                    await pool.execute(updateAvailabilitySql, [product.product_id]);
                }
            }
        } catch (error) {
            console.error('Error updating product quantities:', error);
            throw error;
        }
    }

    static async getByOrderedType() {
        const sql = `
            SELECT orders.*, 
            DATE_FORMAT(orders.order_date, '%Y-%m-%d %H:%i:%s') AS order_date,
            customers.customer_id,
            customers.email,
            customers.isCompany,
            CONCAT(customers.fname, ' ', customers.lname) AS customerName,
            order_type.type_name 
            FROM orders
            INNER JOIN customers ON orders.customer_id = customers.customer_id
            INNER JOIN order_type ON orders.type_id = order_type.type_id
            WHERE orders.type_id = 1
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async updateOrderType(order_id, trackingNumber) {
        const sql = 'UPDATE orders SET type_id = 2, trackingNumber = ? WHERE order_id = ?';
        const [rows] = await pool.execute(sql, [trackingNumber || null, order_id]);
        return rows;
    }

    static async getOrdersByMonth(date) {
        const [year, month] = date.split('-');
        const sql = 'SELECT * FROM orders WHERE MONTH(orders.order_date) = ? AND YEAR(orders.order_date) = ?';

        const [rows] = await pool.execute(sql, [month, year]);
        return rows;
    }

    static async getUserFromOrderId(orderId) {
        const sql =
            'SELECT customers.*,  DATE_FORMAT(order_date, "%Y-%m-%d %H:%i:%s") AS order_date FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id WHERE order_id = ?';
        const [rows] = await pool.execute(sql, [orderId]);
        return rows[0];
    }

    static async getOrderByFilter(key, value) {
        let sql = `
            SELECT orders.*, 
            DATE_FORMAT(orders.order_date, '%Y-%m-%d %H:%i:%s') AS order_date,
            customers.customer_id,
            CONCAT(customers.fname, ' ', customers.lname) AS customerName,
            customers.email,
            customers.phone,
            customers.isCompany,
            order_type.type_name
            FROM orders
            INNER JOIN customers ON orders.customer_id = customers.customer_id
            INNER JOIN order_type ON orders.type_id = order_type.type_id
        `;
        if (key === 'order_date') {
            const [from, to] = value.split('to').map(v => v.trim());
            sql += `WHERE DATE_FORMAT(orders.${key}, '%Y-%m-%d') BETWEEN '${from}' AND '${to || from}'`;
            // const values = [from, to];
        } else {
            sql += `WHERE orders.${key} = ${value}`;
        }
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getOrdersTotalPriceAndCount(date) {
        const [year, month] = date.split('-');

        const sql =
            'SELECT SUM(sub_total) AS total_price, COUNT(*) AS orders_count FROM orders WHERE MONTH(orders.order_date) = ? AND YEAR(orders.order_date) = ?';
        const [rows] = await pool.execute(sql, [month, year]);
        return rows;
    }

    static async getOrdersTotalPriceForChart(year) {
        const sql = `
             SELECT
                 MONTH(order_date) AS month,
                 SUM(sub_total) AS total_price,
                 COUNT(*) AS orders_count
             FROM
                 orders
             WHERE
                 YEAR(order_date) = ?
             GROUP BY
                 MONTH(order_date)
             ORDER BY
                 MONTH(order_date) ASC
         `;

        const [rows] = await pool.execute(sql, [year]);
        return rows;
    }

    static async getOrderDetails(orderId) {
        const sql = `
            SELECT 
                *, 
                DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders 
        `;
        const [rows] = await pool.execute(sql, [orderId]);
        return rows[0];
    }

    static async isOrderCommitted(paymentId) {
        const sql = `
            SELECT orders.order_id, payments.payment_id, payments.status
            FROM orders 
            INNER JOIN payments 
            ON orders.order_id = payments.order_id
            WHERE payments.payment_id = ?;
        `;
        const [rows] = await pool.execute(sql, [paymentId]);
        // Assuming "committed" means that the payment status is a certain value, e.g., 2
        if (rows?.length === 1) {
            return rows[0].status === 2;
        } else {
            return false;
        }
    }
}

module.exports = Order;
