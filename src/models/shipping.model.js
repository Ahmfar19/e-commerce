const pool = require('../databases/mysql.db');

class Shipping {
    constructor(options) {
        this.shipping_name = options.shipping_name;
        this.shipping_price = options.shipping_price;
        this.shipping_time = options.shipping_time;
    }
    async save() {
        const sql = `INSERT INTO shipping (
            shipping_name,
            shipping_price,
            shipping_time
        ) VALUES (
            "${this.shipping_name}",
             ${this.shipping_price},
             ${this.shipping_time}
        )`;
        const result = await pool.execute(sql);
        this.shipping_id = result[0].insertId;
        return this.shipping_id;
    }
    static async getAll() {
        const sql = 'SELECT * FROM shipping';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getById(id) {
        const sql = `SELECT * FROM shipping WHERE shipping_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id) {
        const sql = `UPDATE shipping SET 
        shipping_name = "${this.shipping_name}",
        shipping_price = "${this.shipping_price}",
        shipping_time = ${this.shipping_time}
        WHERE shipping_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM shipping WHERE shipping_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Shipping;
