const pool = require('../databases/mysql.db');

class Product {
    constructor(options) {
        this.category_id = options.category_id;
        this.image = options.image || '';
        this.name = options.name;
        this.description = options.description || '';
        this.price = options.price;
        this.discount = options.discount || 0; // Set default discount to 0 if not provided
        this.total_quantity = options.total_quantity;
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
            total_quantity,
            available
        ) VALUES (
           ${this.category_id}, 
            '${this.image}', 
            "${this.name}",
            "${this.description}", 
            ${this.price},
            ${this.discount},
            ${this.total_quantity},
            ${this.available}
        )`;
        const result = await pool.execute(sql);
        this.id = result[0].insertId;
        return this.id;
    }

    static async getAll() {
        const sql = 'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getSingleById(id) {
        const sql =
            `SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id WHERE id = "${id}"`;
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
        total_quantity = ?,
        available = ?
        WHERE id = ?`;
        const values = [
            this.category_id,
            this.image,
            this.name,
            this.description,
            this.price,
            this.discount,
            this.total_quantity,
            this.available,
            id,
        ];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM products WHERE id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getPaginated(page, pageSize) {
        const offset = (page - 1) * pageSize;
        const sql =
            'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id LIMIT ? OFFSET ?';
        const [rows] = await pool.execute(sql, [pageSize, offset]);
        return rows;
    }

    static async filterByName(searchTerm) {
        const sql =
            'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id WHERE products.name LIKE ?';
        const [rows] = await pool.execute(sql, [`%${searchTerm}%`]);
        return rows;
    }

    static async getProductByFilter(key, value) {
        const sql = `
                SELECT * FROM products 
                INNER JOIN categories ON products.category_id = categories.category_id 
                WHERE products.${key} = ?
            `;
        const [rows] = await pool.execute(sql, [value]);
        return rows;
    }

    static async getMulti(productIds) {
        if (!Array.isArray(productIds) || productIds.length === 0) {
            throw new Error('Invalid product IDs array');
        }

        // Create placeholders for each product ID in the SQL query
        const placeholders = productIds.map(() => '?').join(',');

        // SQL query with placeholders for product IDs
        const sql = `SELECT id, total_quantity FROM products WHERE id IN (${placeholders})`;
        try {
            //   Execute SQL query with product IDs as parameters
            const [rows] = await pool.execute(sql, productIds);
            return rows;
        } catch (error) {
            throw new Error('Failed to check product quantities.');
        }
    }

    static async getPopular(limit) {
        const sql = `SELECT 
        order_items.product_id,
        products.name,
        products.price,
        categories.category_name,
        SUM(order_items.quantity) AS quantity
        FROM 
        order_items
        INNER JOIN 
        products 
        ON 
        products.id = order_items.product_id
        INNER JOIN
        categories
        ON
        products.category_id = categories.category_id
        GROUP BY 
        order_items.product_id
        ORDER BY 
        quantity LIMIT ?`;
        const [rows] = await pool.execute(sql, [limit]);
        return rows;
    }

    static async filterByPriceRange(minPrice, maxPrice) {
        const sql = `
        SELECT 
            p.*, 
            c.category_name 
        FROM 
            products p
        INNER JOIN 
            categories c ON p.category_id = c.category_id
        WHERE 
            p.price BETWEEN ? AND ?`;

        try {
            const [rows] = await pool.execute(sql, [minPrice, maxPrice]);
            return rows;
        } catch (error) {
            throw new Error('Failed to filter products by price range.');
        }
    }
}

module.exports = Product;
