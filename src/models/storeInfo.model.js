const pool = require('../databases/mysql.db');

class StoreInfo {
    constructor(options) {
        this.opening_day = options.opening_day;
        this.closing_day = options.closing_day;
        this.opening_weekend = options.opening_weekend;
        this.closing_weekend = options.closing_weekend;
        this.tax_percentage = options.tax_percentage;
        this.phone = options.phone;
        this.adress = options.adress;
        this.email = options.email;
    }

    async save() {
        const sql = `INSERT INTO store_info (
            opening_day,
            closing_day,
            opening_weekend,
            closing_weekend,
            tax_percentage,
            phone,
            email,
            adress,
        ) VALUES (
            "${this.opening_day}",
            "${this.closing_day}",
            "${this.opening_weekend}",
            "${this.closing_weekend}",
            "${this.tax_percentage}",
           " ${this.phone}",
           " ${this.email}",
           " ${this.adress}"
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
            opening_day = ?,
            closing_day = ?,
            opening_weekend = ?,
            closing_weekend = ?,
            tax_percentage = ?,
            phone = ?,
            email = ?,
            adress = ?
            WHERE id = ?`;
        const values = [
            this.opening_day,
            this.closing_day,
            this.opening_weekend,
            this.closing_weekend,
            this.tax_percentage,
            this.phone,
            this.email,
            this.adress,
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
