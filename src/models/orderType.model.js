const pool = require('../databases/mysql.db');

class OrderType {
    constructor(options) {
        this.type_name = options.type_name;
    }
    async save() {
        const sql = `INSERT INTO order_type (
            type_name
        ) VALUES (
            "${this.type_name}"
        )`;
        const result = await pool.execute(sql);
        this.type_id = result[0].insertId;
        return this.type_id;
    }
    static async getAll() {
        const sql = 'SELECT * FROM order_type';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getById(id) {
        const sql = `SELECT * FROM order_type WHERE type_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id) {
        const sql = `UPDATE order_type SET 
        type_name = "${this.type_name}"
        WHERE type_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM order_type WHERE type_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = OrderType;
