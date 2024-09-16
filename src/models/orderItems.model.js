const { pool, sequelize } = require('../databases/mysql.db');
const { calculateVatAmount } = require('../helpers/utils');
const Shipping = require('./shipping.model');
const StoreInfo = require('./storeInfo.model');

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
        this.returned = options.returned || false;
        this.refundedQuantity = options.refundedQuantity || 0;
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

        const priceAfterDiscount = this.price - (this.discount || 0);
        const productPrice = priceAfterDiscount * this.quantity;
        const totalDiscount = this.quantity * (this.discount || 0);

        const values = [
            this.order_id,
            this.product_id,
            this.product_name,
            this.articelNumber,
            productPrice,
            this.unit_name,
            totalDiscount,
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

            const priceAfterDiscount = product.price - (product.discount || 0);
            const productPrice = priceAfterDiscount * product.quantity;
            const totalDiscount = product.quantity * (product.discount || 0);

            const values = [
                product_items.order_id,
                product.product_id,
                product.name,
                product.articelNumber,
                productPrice,
                product.unit_name,
                totalDiscount,
                product.image,
                product.quantity,
            ];

            if (transaction) {
                return await sequelize.query(sql, { replacements: values, transaction });
            } else {
                return await pool.execute(sql, values);
            }
        });
        const [rows] = await Promise.all(insertionPromises);
        return rows;
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

    static async updateMulti(product_items, transaction) {
        if (!Array.isArray(product_items) || product_items.length === 0) {
            throw new Error('Invalid order items');
        }

        const updatePromises = product_items.map(async (item) => {
            const sql = `UPDATE order_items SET 
                         product_name = ?,
                         price = ?,
                         quantity = ?,
                         discount = ?,
                         refundedQuantity = refundedQuantity + ?
                         WHERE item_id = ? AND order_id = ? AND product_id = ?`;

            const priceAfterDiscount = item.price - (item.discount || 0);
            const productPrice = priceAfterDiscount * item.orginalQuantity;
            const totalDiscount = item.orginalQuantity * (item.discount || 0);
            const refundedQuantity = (item.quantity) * (-1);
            const values = [
                item.product_name,
                productPrice,
                item.orginalQuantity,
                totalDiscount,
                refundedQuantity,
                item.item_id,
                item.order_id,
                item.product_id,
            ];

            try {
                const [result] = await sequelize.query(sql, { replacements: values, transaction });
                return result;
            } catch (error) {
                console.error(`Error updating item ${item.item_id}:`, error);
                throw error;
            }
        });
        try {
            const results = await Promise.all(updatePromises);
            return results;
        } catch (error) {
            console.error('Error updating multiple order items:', error);
            throw error;
        }
    }

    static async deleteMulti(product_items, transaction) {
        if (!Array.isArray(product_items) || product_items.length === 0) {
            throw new Error('Invalid order items');
        }

        const itemIds = product_items.map(item => item.item_id);

        const sql = `UPDATE order_items
                     SET returned = true
                     WHERE item_id IN (?)`;

        try {
            if (transaction) {
                const result = await sequelize.query(sql, { replacements: [itemIds], transaction });
                return result;
            } else {
                const result = await pool.query(sql, [itemIds]);
                return result;
            }
        } catch (error) {
            console.error('Error deleting multiple order items:', error);
            throw error;
        }
    }

    static async updateOrderByOrderItems(order_id, transaction) {
        const [storeInfo] = await StoreInfo.getAll();

        const { shipping_price } = await Shipping.getShippingPrice();

        const selectSql = `
            SELECT 
                SUM(price) AS sub_total, 
                SUM(discount) AS items_discount
            FROM order_items 
            WHERE order_id = ? 
            AND returned = false;
        `;
        let rows = [];
        if (transaction) {
            [rows] = await sequelize.query(selectSql, {
                replacements: [order_id],
                transaction,
            });
        } else {
            [rows] = await pool.execute(selectSql, [order_id]);
        }
        if (rows.length === 0) {
            throw new Error('No order items found for this order.');
        }

        const { sub_total, items_discount } = rows[0];

        const vatAmount = calculateVatAmount(sub_total, storeInfo.tax_percentage);

        const updateSql = `
           UPDATE orders 
              SET 
              sub_total = ?, 
              shipping_price = CASE WHEN sub_total >= ${storeInfo.free_shipping} THEN 0 ELSE ${shipping_price} END,
              items_discount = ?, 
              total = ? + shipping_price,
              tax = ? 
              WHERE order_id = ?;
           `;

        const total = sub_total;

        if (transaction) {
            const [result] = await sequelize.query(updateSql, {
                replacements: [sub_total, items_discount, total, vatAmount, order_id],
                transaction,
            });

            return result;
        } else {
            const [result] = await pool.execute(updateSql, [sub_total, items_discount, total, order_id]);
            return result;
        }
    }
}

module.exports = OrderItems;
