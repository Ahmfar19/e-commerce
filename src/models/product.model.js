const pool = require('../databases/mysql.db');

class Product {
    constructor(options) {
        this.category_id = options.category_id;
        this.image = options.image || '';
        this.title = options.title;
        this.description = options.description;
        this.price = options.price;
        this.stock = options.stock;
    }
    async save() {
        const sql = `INSERT INTO products (
            category_id,
            image,
            title,
            description,
            price,
            stock
        ) VALUES (
             ${this.category_id},
             '${this.image}',
            "${this.title}",
            "${this.description}",
             ${this.price},
             ${this.stock}
        )`;
        const result = await pool.execute(sql);
        this.product_id = result[0].insertId;
        return this.product_id;
    }
    static async getAll() {
        const sql = 'SELECT * FROM products';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getSingleById(id) {
        const sql = `SELECT * FROM products WHERE product_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateById(id) {
        const sql = `UPDATE products SET 
        category_id = ${this.category_id},
        image = '${this.image}',
        title = "${this.title}",
        description = "${this.description}",
        price = ${this.price},
        stock = ${this.stock}
        WHERE product_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM products WHERE product_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Product;
