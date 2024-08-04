const pool = require('../databases/mysql.db');

class Order {
    constructor(options) {
        this.customer_id = options.customer_id;
        this.type_id = options.type_id;
        this.order_date = options.order_date;
        this.shipping_name = options.shipping_name;
        this.shipping_price = options.shipping_price;
        this.shipping_time = options.shipping_time;
        this.sub_total = options.sub_total;
        this.tax = options.tax;
        this.items_discount = options.items_discount;
        this.total = options.total;
    }

    async save() {
        const sql = `INSERT INTO orders (
            customer_id,
            type_id,
            order_date,
            shipping_name,
            shipping_price,
            shipping_time,
            sub_total,
            tax,
            items_discount,
            total
        ) VALUES (
            ${this.customer_id},
            ${this.type_id},
            "${this.order_date}",
            "${this.shipping_name}",
            ${this.shipping_price},
            ${this.shipping_time},
            ${this.sub_total},
            ${this.tax},
            ${this.items_discount},
            ${this.total}
        )`;
        const result = await pool.execute(sql);
        this.order_id = result[0].insertId;
        return this.order_id;
    }

    static async getAll() {
        const sql = `SELECT orders.*, 
       DATE_FORMAT(orders.order_date, '%Y-%m-%d %H:%i:%s') AS order_date,
       customers.customer_id,
       CONCAT(customers.fname, ' ', customers.lname) AS customerName,
       order_type.type_name 
       FROM orders
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
                *, 
                DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders 
                INNER JOIN customers ON orders.customer_id = customers.customer_id
                INNER JOIN order_type ON orders.type_id = order_type.type_id
                WHERE order_id = ?`;
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
                const [rows] = await pool.execute(checkQuantitySql, [
                    product.product_id,
                ]);

                if (rows[0].quantity === 0) {
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

    static async getByType() {
        const sql = `
            SELECT orders.*, 
            DATE_FORMAT(orders.order_date, '%Y-%m-%d %H:%i:%s') AS order_date,
            customers.customer_id,
            CONCAT(customers.fname, ' ', customers.lname) AS customerName,
            order_type.type_name 
            FROM orders
            INNER JOIN customers ON orders.customer_id = customers.customer_id
            INNER JOIN order_type ON orders.type_id = order_type.type_id
            WHERE orders.type_id = 2
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async updateOrderType(order_id) {
        const sql = 'UPDATE orders SET type_id = 3 WHERE order_id = ?';
        const [rows] = await pool.execute(sql, [order_id]);
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
            'SELECT customers.email, CONCAT(customers.fname, " ", customers.lname) AS customerName FROM orders INNER JOIN customers ON orders.customer_id = customers.customer_id WHERE order_id = ?';
        const [rows] = await pool.execute(sql, [orderId]);
        return rows;
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
            sql += `WHERE DATE_FORMAT(orders.${key}, '%Y-%m-%d') BETWEEN '${from}' AND '${to}'`;
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
            'SELECT SUM(total) AS total_price, COUNT(*) AS orders_count FROM orders WHERE MONTH(orders.order_date) = ? AND YEAR(orders.order_date) = ?';
        const [rows] = await pool.execute(sql, [month, year]);
        return rows;
    }

    static async getOrdersTotalPriceForChart(year) {
        const sql = `
             SELECT
                 MONTH(order_date) AS month,
                 SUM(total) AS total_price,
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
}

module.exports = Order;
