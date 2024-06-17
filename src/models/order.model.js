const pool = require('../databases/mysql.db');

class Order {

    constructor(options) {
        this.customer_id = options.customer_id;
        this.type_id = options.type_id;
        this.order_date = options.order_date;
        this.sub_total = options.sub_total;
        this.tax = options.tax;
        this.items_discount = options.items_discount;
        this.shipping = options.shipping;
        this.total = options.total;
    }

    async save() {
        const sql = `INSERT INTO orders (
            customer_id,
            type_id,
            order_date,
            sub_total,
            tax,
            items_discount,
            shipping,
            total
        ) VALUES (
            ${this.customer_id},
            ${this.type_id},
            "${this.order_date}",
            ${this.sub_total},
            ${this.tax},
            ${this.items_discount},
            ${this.shipping},
            ${this.total}
        )`;
        const result = await pool.execute(sql);
        this.order_id = result[0].insertId;
        return this.order_id;
    }

    static async getAll() {
        const sql = `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteAll() {
        const sql = `DELETE FROM orders`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByCustomerId(customer_id){
        const sql = `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date 
        FROM  orders where customer_id = ?`;
        const [rows] = await pool.execute(sql, [customer_id]);
        return rows;
    }

    static async deleteOrderByCustomerId(customer_id){
        const sql = `DELETE FROM orders where customer_id = ?`;
        const [rows] = await pool.execute(sql, [customer_id]);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM orders where order_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT *, DATE_FORMAT(order_date, '%Y-%m-%d %H:%i:%s') AS order_date FROM orders where order_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    // static async updateById(id){
    //     const sql = `UPDATE orders SET 
    //     category_id = ?,
    //     image = ?,
    //     name = ?,
    //     description = ?,
    //     price = ?,
    //     discount = ?,
    //     quantity = ?,
    //     available = ?
    //     WHERE product_id = ?`;
    //     const values = [
    //         this.category_id,
    //         this.image,
    //         this.name,
    //         this.description,
    //         this.price,
    //         this.discount,
    //         this.quantity,
    //         this.available,
    //         id
    //     ];
    //     const [rows] = await pool.execute(sql, values);
    //     return rows;
    // }

    static async checkCustomerIfExisted(email) {
        const sql = `SELECT * FROM customers WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }
}

module.exports = Order;
