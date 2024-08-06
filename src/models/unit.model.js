const { pool } = require('../databases/mysql.db');

class Unit {
    constructor(options) {
        this.unit_name = options.unit_name;
    }
    async save() {
        const sql = `INSERT INTO units (
            unit_name
        ) VALUES (
            "${this.unit_name}"
        )`;
        const result = await pool.execute(sql);
        this.unit_id = result[0].insertId;
        return this.unit_id;
    }
    static async getAllUnits() {
        const sql = 'SELECT * FROM units';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getUnitById(id) {
        const sql = `SELECT * FROM units WHERE unit_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async updateById(id, updatedData) {
        const sql = `UPDATE units SET 
            unit_name = ?
            WHERE unit_id = ?`;
        const [result] = await pool.execute(sql, [updatedData.unit_name, id]);

        return result;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM units WHERE unit_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Unit;
