const { pool, sequelize } = require('../databases/mysql.db');

class OrderItems {
    constructor(options) {
        this.order_id = options.order_id;
        this.product_id = options.product_id;
        this.product_name = options.product_name;
        this.articelNumber = options.articelNumber;
        this.price = options.price;
        this.unit_name = options.unit_name;
        this.discount = options.discount;
        this.image = options.image;
        this.quantity = options.quantity;
    }

    async save() {
        const sql = `INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            articelNumber,
            price,
            unit_name,
            discount,
            image,
            quantity
        ) VALUES (
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?,
            ?
        )`;
        const values = [
            this.order_id,
            this.product_id,
            this.product_name,
            this.articelNumber,
            this.price,
            this.unit_name,
            this.discount,
            this.image,
            this.quantity,
        ];
        const result = await pool.execute(sql, values);
        this.item_id = result[0].insertId;
        return this.item_id;
    }

    static async saveMulti(product_items, transaction) {
        if (!Array.isArray(product_items.products) || product_items.products.length === 0) {
            throw new Error('Invalid report items data');
        }
        // Create an array of promises for report item insertion
        const insertionPromises = product_items.products.map(async (product) => {
            const sql = `INSERT INTO order_items 
            (order_id, product_id ,product_name, articelNumber, price, unit_name, discount, image, quantity) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [
                product_items.order_id,
                product.product_id,
                product.name,
                product.articelNumber,
                product.price,
                product.unit_name,
                product.discount,
                product.image,
                product.quantity,
            ];
            if (transaction) {
                return await sequelize.query(sql, { replacements: values, transaction });
            } else {
                return await pool.execute(sql, values);
            }
        });
        await Promise.all(insertionPromises);
    }

    static async getItemsByOrderId(orderId) {
        if (!orderId) {
            throw new Error('Invalid order ID');
        }
        const sql = `
            SELECT * FROM order_items
            WHERE order_items.order_id = ${orderId}
        `;
        try {
            const [rows] = await pool.execute(sql);
            return rows;
        } catch {
            throw new Error('Failed to get the order items');
        }
    }
}

module.exports = OrderItems;
