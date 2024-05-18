const pool = require('../databases/mysql.db');

class Category {
    constructor(options) {
        this.category_name = options.category_name;
    }
    async save() {
        const sql = `INSERT INTO categories (
            category_name
        ) VALUES (
            "${this.category_name}"
        )`;
        const result = await pool.execute(sql);
        this.category_id = result[0].insertId;
        return this.category_id;
    }
    static async getAllCategories() {
        const sql = 'SELECT * FROM categories';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getCategoryById(id) {
        const sql = `SELECT * FROM categories WHERE category_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id) {
        const sql = `UPDATE categories SET 
        category_name = "${this.category_name}"
        WHERE category_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM categories WHERE category_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Category;
