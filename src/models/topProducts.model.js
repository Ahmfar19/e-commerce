const pool = require('../databases/mysql.db');
const Product = require('../models/product.model');

class TopProduct {
    constructor(options) {
        this.product_id = options.product_id;
    }

    async save() {
        const sql = `INSERT INTO top_products (product_id) VALUES (?)`;
        const values = [this.product_id];
        const result = await pool.execute(sql, values);
        this.id = result[0].insertId;
        return this.id;
    }

    static async getCustomPopular() {
        const sql = `SELECT * FROM top_products INNER JOIN products ON top_products.product_id = products.product_id`;
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
        const sql = `SELECT * FROM top_products INNER JOIN products ON top_products.product_id = products.product_id`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql =
            `SELECT * FROM top_products INNER JOIN products ON top_products.product_id = products.product_id WHERE top_products.id = ?`;
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
        const sql = `DELETE FROM top_products WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }
}

module.exports = TopProduct;
