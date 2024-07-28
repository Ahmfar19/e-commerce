const pool = require('../databases/mysql.db');
const Product = require('./product.model');

class Discount {
    constructor(options) {
        this.product_id = options.product_id;
        this.category_id = options.category_id;
        this.discount_value = options.discount_value;
        this.start_date = options.start_date;
        this.end_date = options.end_date;
    }

    async save() {
        let productIds = [];
        if (this.category_id && this.product_id.length === 0) {
            const [products] = await pool.query(
                'SELECT product_id FROM products WHERE category_id = ?',
                [this.category_id],
            );
            productIds = products.map(product => product.product_id);
        } else if (Array.isArray(this.product_id) && this.product_id.length > 0) {
            productIds = this.product_id;
        } else {
            throw new Error('ec_must_have_products_or_category');
        }

        if (productIds.length === 0) {
            throw new Error('ec_not_found_product_relationship_with_this_category_id');
        }

        // تحقق من وجود أي product_id في جدول discounts مسبقاً
        const [existingDiscounts] = await pool.query(
            'SELECT product_id FROM discounts WHERE product_id IN (?)',
            [productIds],
        );

        if (existingDiscounts.length > 0) {
            const existingProductIds = existingDiscounts.map(discount => discount.product_id);
            throw new Error(`ec_thisProductHaveDiscountAlready`);
        }

        const sql = `
            INSERT INTO discounts (
                product_id,
                discount_value,
                start_date,
                end_date
            ) VALUES ?`;

        const values = productIds.map(id => [
            id,
            this.discount_value,
            this.start_date,
            this.end_date,
        ]);

        const [result] = await pool.query(sql, [values]);
        return result.insertId;
    }

    static async getAll() {
        const sql =
            'SELECT discount_id, product_id, discount_value,  DATE_FORMAT(start_date, "%Y-%m-%d") As start_date ,DATE_FORMAT(end_date, "%Y-%m-%d") As end_date FROM discounts';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM discounts WHERE discount_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateById(id) {
        const sql = `UPDATE discounts SET 
            product_id = ?, 
            discount_value = ?, 
            start_date = ?, 
            end_date = ?
            WHERE discount_id = ?`;

        const params = [
            this.product_id,
            this.discount_value,
            this.start_date,
            this.end_date,
            id,
        ];

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM discounts WHERE discount_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getIds() {
        const sql = `SELECT product_id FROM discounts`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Discount;
