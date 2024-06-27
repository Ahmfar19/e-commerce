const pool = require('../databases/mysql.db');

class StoreInfo {
    constructor(options) {
        this.opening_time = options.opening_time;
        this.closing_time = options.closing_time;
        this.tax_percentage = options.tax_percentage;
        this.phone_number = options.phone_number;
        this.secondary_phone_number = options.secondary_phone_number;
    }

    async save() {
        const sql = `INSERT INTO store_info (
            opening_time,
            closing_time,
            tax_percentage,
            phone_number,
            secondary_phone_number
        ) VALUES (
            "${this.opening_time}",
            "${this.closing_time}",
            "${this.tax_percentage}",
           " ${this.phone_number}",
            "${this.secondary_phone_number}"
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
            phone_number = ?,
            secondary_phone_number = ?
            WHERE id = ?`;
        const values = [
            this.opening_time,
            this.closing_time,
            this.tax_percentage,
            this.phone_number,
            this.secondary_phone_number,
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
}

module.exports = StoreInfo;
