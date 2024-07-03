const pool = require('../databases/mysql.db');

class Order {
    constructor(options) {
        this.customer_id = options.customer_id;
        this.type_id = options.type_id;
        this.shipping_id = options.shipping_id;
        this.order_date = options.order_date;
        this.sub_total = options.sub_total;
        this.tax = options.tax;
        this.items_discount = options.items_discount;
        this.total = options.total;
    }

    async save() {
        const sql = `INSERT INTO orders (
            customer_id,
            type_id,
            shipping_id,
            order_date,
            sub_total,
            tax,
            items_discount,
            total
        ) VALUES (
            ${this.customer_id},
            ${this.type_id},
            ${this.shipping_id},
            "${this.order_date}",
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
        const sql = `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders`;
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
        const sql =
            `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders where order_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async checkCustomerIfExisted(email) {
        const sql = `SELECT * FROM customers WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }

    static async updateProductQuantities(products) {
        try {
            for (const product of products) {
                // تحديث الكمية الإجمالية
                const updateQuantitySql = `
                    UPDATE products
                    SET quantity = quantity - ?
                    WHERE id = ?
                `;
                await pool.execute(updateQuantitySql, [product.quantity, product.product_id]);

                // التحقق إذا أصبحت الكمية الإجمالية تساوي 0
                const checkQuantitySql = `
                    SELECT quantity
                    FROM products
                    WHERE id = ?
                `;
                const [rows] = await pool.execute(checkQuantitySql, [product.product_id]);

                if (rows[0].quantity === 0) {
                    const updateAvailabilitySql = `
                        UPDATE products
                        SET available = false
                        WHERE id = ?
                    `;
                    await pool.execute(updateAvailabilitySql, [product.product_id]);
                }
            }
        } catch (error) {
            console.error('Error updating product quantities:', error);
            throw error;
        }
    }
}

module.exports = Order;
