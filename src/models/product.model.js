const pool = require('../databases/mysql.db');

class Product {
    constructor(options) {
        this.category_id = options.category_id;
        this.image = options.image || '';
        this.name = options.name;
        this.description = options.description || '';
        this.price = options.price;
        this.discount = options.discount || 0; // Set default discount to 0 if not provided
        this.quantity = options.quantity;
        this.available = options.available;
    }
    
    async save() {
        const sql = `INSERT INTO products (
            category_id,
            image,
            name,
            description,
            price,
            discount,
            quantity,
            available
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?
        )`;
        const values = [
            this.category_id,
            this.image,
            this.name,
            this.description,
            this.price,
            this.discount,
            this.quantity,
            this.available
        ];
        const [result] = await pool.execute(sql, values);
        this.product_id = result.insertId;
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
        category_id = ?,
        image = ?,
        name = ?,
        description = ?,
        price = ?,
        discount = ?,
        quantity = ?,
        available = ?
        WHERE product_id = ?`;
        const values = [
            this.category_id,
            this.image,
            this.name,
            this.description,
            this.price,
            this.discount,
            this.quantity,
            this.available,
            id
        ];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }
    static async deleteById(id) {
        const sql = `DELETE FROM products WHERE product_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Product;
