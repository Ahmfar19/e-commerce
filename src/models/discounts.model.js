const pool = require('../databases/mysql.db');

class Discount {
    constructor(options) {
        this.product_id = options.product_id;
        this.category_id = options.category_id;
        this.discount_value = options.discount_value;
        this.start_date = options.start_date;
        this.end_date = options.end_date;
    }

    async save() {
        const sql = `INSERT INTO discounts (
            discount_value,
            start_date,
            end_date
        ) VALUES (?, ?, ?)`;

        const values = [this.discount_value, this.start_date, this.end_date];

        const [result] = await pool.execute(sql, values);
        this.discount_id = result.insertId;
        return this.discount_id;
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

    static async getAllProductIdsAndName() {
        const sql = `SELECT products.product_id, products.name 
              FROM discounts 
             INNER JOIN products ON discounts.product_id = products.product_id;
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getDiscountFilter(key, value) {
        const sql = `
            SELECT 
            discounts.discount_id,
            discounts.product_id,
            discounts.discount_value As discount
            DATEFORMAT
            FROM discounts
            INNER JOIN products ON discounts.product_id = products.product_id
            WHERE discounts.${key} = ?
        `;
        const [rows] = await pool.execute(sql, [value]);
        return rows;
    }
    static async updateProductDiscountId(discountId, product_id, category_id) {
        let productIds = [];
        if (category_id && (!product_id || product_id.length === 0)) {
            const [products] = await pool.query(
                'SELECT product_id FROM products WHERE category_id = ?',
                [category_id],
            );
            productIds = products.map(product => product.product_id);
        } else if (Array.isArray(product_id) && product_id.length > 0) {
            productIds = product_id;
        } else {
            throw new Error('ec_must_have_products_or_category');
        }

        if (productIds.length === 0) {
            throw new Error('ec_not_found_product_relationship_with_this_category_id');
        }

        const placeholders = productIds.map(() => '?').join(',');

        const sql = `
            UPDATE products
            SET discount_id = ?
            WHERE product_id IN (${placeholders})
            AND discount_id IS NULL
        `;

        try {
            const [result] = await pool.execute(sql, [discountId, ...productIds]);

            if (result.affectedRows === 0) {
                throw new Error('ec_thisProductHaveDiscountAlready');
            }

            return result.affectedRows;
        } catch (error) {
            console.error('Error updating discount_id:', error);
            throw error;
        }
    }
}

module.exports = Discount;
