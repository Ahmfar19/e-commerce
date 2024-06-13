const pool = require('../databases/mysql.db');

class WishList {
    constructor(options) {
        this.product_id = options.product_id;
        this.customer_id = options.customer_id;
        this.quantity = options.quantity;
    }
    async save() {
        const sql = `INSERT INTO wishlists (
            product_id,
            customer_id,
            quantity
        ) VALUES (
             ${this.product_id},
             ${this.customer_id},
             ${this.quantity}
        )`;
        const result = await pool.execute(sql);
        this.Wishlist_id = result[0].insertId;
        return this.Wishlist_id;
    }
    static async getAll(customer_id) {
        const sql = `SELECT * FROM wishlists WHERE customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getSingleById(id, customer_id) {
        const sql = `SELECT * FROM wishlists WHERE Wishlist_id = "${id}" AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id, customer_id) {
        const sql = `UPDATE wishlists SET 
        product_id = ${this.product_id},
        customer_id = ${this.customer_id},
        quantity = ${this.quantity}
        WHERE Wishlist_id = ${id} AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id, customer_id) {
        const sql = `DELETE FROM wishlists WHERE Wishlist_id = "${id}" AND customer_id = ${customer_id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = WishList;
