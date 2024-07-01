const pool = require('../databases/mysql.db');

class OrderItems {
    constructor(options) {
        this.order_id = options.order_id;
        this.product_id = options.product_id;
        this.quantity = options.quantity;
        this.price = options.price;
        this.discount = options.discount;
    }

    async save() {
        const sql = `INSERT INTO order_items (
            order_id,
            product_id,
            quantity,
            price,
            discount
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?
        )`;
        const values = [
            this.order_id,
            this.product_id,
            this.quantity,
            this.price,
            this.discount,
        ];
        const result = await pool.execute(sql, values);
        this.order_Item = result[0].insertId;
        return this.order_Item;
    }

    static async saveMulti(product_items) {
        if (!Array.isArray(product_items.products) || product_items.products.length === 0) {
            throw new Error('Invalid report items data');
        }
        // Create an array of promises for report item insertion
        const insertionPromises = product_items.products.map(async (product) => {
            const sql = `INSERT INTO order_items (order_id, product_id, quantity) VALUES (?, ?, ?)`;
            const values = [product_items.order_id, product.product_id, product.quantity];
            return await pool.execute(sql, values);
        });
        await Promise.all(insertionPromises);
    }

    static async checkQuantity(productIds) {
        if (!Array.isArray(productIds) || productIds.length === 0) {
            throw new Error('Invalid product IDs array');
        }

        // Create placeholders for each product ID in the SQL query
        const placeholders = productIds.map(() => '?').join(',');

        // SQL query with placeholders for product IDs
        const sql = `SELECT id, total_quantity FROM products WHERE id IN (${placeholders})`;
        try {
            //   Execute SQL query with product IDs as parameters
            const [rows] = await pool.execute(sql, productIds);
            return rows;
        } catch (error) {
            throw new Error('Failed to check product quantities.');
        }
    }
}

module.exports = OrderItems;
