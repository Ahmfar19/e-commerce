const pool = require('../databases/mysql.db');

class TopProduct {
    constructor(options) {
        this.product_id = options.product_id;
        this.display_order = options.display_order;
    }

    async save() {
        const sql = `INSERT INTO top_products (product_id, display_order) VALUES (?, ?)`;
        const values = [this.product_id, this.display_order];
        const result = await pool.execute(sql, values);
        this.id = result[0].insertId;
        return this.id;
    }

    static async getAll() {
        const sql =
            `SELECT * FROM top_products INNER JOIN products ON top_products.product_id = products.product_id ORDER BY top_products.display_order`;
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
        const sql = `UPDATE top_products SET product_id = ?, display_order = ? WHERE id = ?`;
        const values = [options.product_id, options.display_order, id];
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
