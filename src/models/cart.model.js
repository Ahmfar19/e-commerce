const pool = require('../databases/mysql.db');

class Cart {
    constructor(options) {
        this.customer_id = options.customer_id;
        this.product_id = options.product_id;
        this.quantity = options.quantity;
    }
    async save() {
        const sql = `INSERT INTO carts (
            customer_id,
            product_id,
            quantity
        ) VALUES (
             ${this.customer_id},
             ${this.product_id},
             ${this.quantity}
        )`;
        const result = await pool.execute(sql);
        this.cart_id = result[0].insertId;
        return this.cart_id;
    }
    static async getAll(customer_id) {
        const sql = `SELECT * FROM carts WHERE customer_id =${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getSingleById(id, customer_id) {
        const sql = `SELECT * FROM carts WHERE cart_id = "${id}" AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id, customer_id) {
        const sql = `UPDATE carts SET 
        customer_id = ${this.customer_id},
        product_id = ${this.product_id},
        quantity = ${this.quantity}
        WHERE cart_id = ${id} AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id, customer_id) {
        const sql = `DELETE FROM carts WHERE cart_id = "${id}" AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Cart;
