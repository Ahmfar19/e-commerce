const { pool } = require('../databases/mysql.db');
const Product = require('../models/product.model');

class TopProduct {
    constructor(options) {
        this.product_id = options.product_id;
    }

    async save() {
        if (!Array.isArray(this.product_id) || this.product_id.length === 0) {
            throw new Error('productIds must be a non-empty array');
        }
        const sql = `INSERT INTO top_products (product_id) VALUES ${this.product_id.map(() => '(?)').join(', ')}`;

        try {
            const result = await pool.execute(sql, this.product_id.flat());
            return result[0].affectedRows;
        } catch {
            throw new Error('Database execution failed');
        }
    }

    static async getCustomPopular() {
        const sql = `SELECT 
        top_products.id,
        products.product_id,
        products.category_id,
        discounts.discount_id,
        units.unit_id,
        unit_name,
        name,
        description,
        price,
        quantity,
        image,
        available,
        articelNumber,
        discount_value As discount
        FROM top_products 
        INNER JOIN products ON top_products.product_id = products.product_id
        INNER JOIN units ON products.unit_id = units.unit_id
        LEFT JOIN discounts ON products.discount_id = discounts.discount_id
        `;

        let [rows] = await pool.execute(sql);

        if (rows.length < 10) {
            const popularProducts = await Product.getPopular(10) || [];
            const leftToTeen = 10 - rows.length;
            rows = [...rows, ...popularProducts.slice(0, leftToTeen)];
        }
        if (rows.length < 10) {
            const ids = rows.map((prodcut) => prodcut.product_id);
            const getRandomProducts = await Product.getRandomProducts(ids) || [];
            const leftToTeen = 10 - rows.length;
            rows = [...rows, ...getRandomProducts.slice(0, leftToTeen)];
        }
        return rows;
    }

    static async getAll() {
        const sql = `SELECT 
        top_products.id,
        products.product_id,
        products.category_id,
        discounts.discount_id,
        units.unit_id,
        unit_name,
        name,
        description,
        price,
        quantity,
        image,
        available,
        articelNumber,
        discount_value As discount
        FROM top_products 
        INNER JOIN products ON top_products.product_id = products.product_id
        INNER JOIN units ON products.unit_id = units.unit_id
        LEFT JOIN discounts ON products.discount_id = discounts.discount_id`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT 
        top_products.id,
        products.product_id,
        products.category_id,
        discounts.discount_id,
        units.unit_id,
        unit_name,
        name,
        description,
        price,
        quantity,
        image,
        available,
        articelNumber,
        discount_value As discount
        FROM top_products 
        INNER JOIN products ON top_products.product_id = products.product_id
        INNER JOIN units ON products.unit_id = units.unit_id
        LEFT JOIN discounts ON products.discount_id = discounts.discount_id  
        WHERE top_products.id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    static async updateById(id, options) {
        const sql = `UPDATE top_products SET product_id = ? WHERE id = ?`;
        const values = [options.product_id, id];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM top_products WHERE product_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async getIds() {
        const sql = `SELECT product_id FROM top_products`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = TopProduct;
