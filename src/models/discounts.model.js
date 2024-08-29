const { pool } = require('../databases/mysql.db');

class Discount {
    constructor(options) {
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
            'SELECT discount_id, discount_value,  DATE_FORMAT(start_date, "%Y-%m-%d") As start_date ,DATE_FORMAT(end_date, "%Y-%m-%d") As end_date FROM discounts';
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
            discount_value = ?, 
            start_date = ?, 
            end_date = ?
            WHERE discount_id = ?`;

        const params = [
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

    static async deleteDiscountByEndDate(year, month, day) {
        const sql = `DELETE FROM discounts WHERE end_date < '${year}-${month}-${day}'`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Discount;
