const pool = require('../databases/mysql.db');

class Discount {
    constructor(options) {
        this.product_id = options.product_id;
        this.discount_value = options.discount_value;
        this.start_date = options.start_date;
        this.end_date = options.end_date;
    }

    async save() {
        if (!Array.isArray(this.product_id)) {
            throw new Error('product_id should be an array');
        }

        const sql = `
            INSERT INTO discounts (
                product_id,
                discount_value,
                start_date,
                end_date
            ) VALUES ?`;

        const values = this.product_id.map(id => [
            id,
            this.discount_value,
            this.start_date,
            this.end_date,
        ]);

        const [result] = await pool.query(sql, [values]);
        return result.insertId;
    }

    static async getAll() {
        const sql =
            'SELECT discount_id, product_id, discount_value,  DATE_FORMAT(start_date, "%Y-%m-%d") As start_date ,DATE_FORMAT(end_date, "%Y-%m-%d") As end_date FROM discounts';
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
            product_id = ?, 
            discount_value = ?, 
            start_date = ?, 
            end_date = ?
            WHERE discount_id = ?`;

        const params = [
            this.product_id,
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
}

module.exports = Discount;
