const pool = require('../databases/mysql.db');

class StoreInfo {
    constructor(options) {
        this.opening_time = options.opening_time;
        this.closing_time = options.closing_time;
        this.tax_percentage = options.tax_percentage;
        this.phone = options.phone;
        this.secondaryPhone = options.secondaryPhone;
    }

    async save() {
        const sql = `INSERT INTO store_info (
            opening_time,
            closing_time,
            tax_percentage,
            phone,
            secondaryPhone
        ) VALUES (
            "${this.opening_time}",
            "${this.closing_time}",
            "${this.tax_percentage}",
           " ${this.phone}",
            "${this.secondaryPhone}"
        )`;
        const result = await pool.execute(sql);
        this.id = result[0].insertId;
        return this.id;
    }

    static async getAll() {
        const sql = `SELECT * FROM store_info`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    async updateById(id) {
        const sql = `UPDATE store_info SET 
            opening_time = ?,
            closing_time = ?,
            tax_percentage = ?,
            phone = ?,
            secondaryPhone = ?
            WHERE id = ?`;
        const values = [
            this.opening_time,
            this.closing_time,
            this.tax_percentage,
            this.phone,
            this.secondaryPhone,
            id,
        ];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM store_info WHERE id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getTax() {
        const sql = `SELECT tax_percentage FROM store_info`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = StoreInfo;
