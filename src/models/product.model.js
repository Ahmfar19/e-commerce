const pool = require('../databases/mysql.db');
const TopProduct = require('./topProducts.model');
class Product {
    constructor(options) {
        this.category_id = options.category_id;
        this.articelNumber = options.articelNumber;
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
            articelNumber,
            image,
            name,
            description,
            price,
            discount,
            quantity,
            available
        ) VALUES (
           ${this.category_id}, 
           ${this.articelNumber}, 
            '${this.image}', 
            "${this.name}",
            "${this.description}", 
            ${this.price},
            ${this.discount},
            ${this.quantity},
            ${this.available}
        )`;
        const result = await pool.execute(sql);
        this.product_id = result[0].insertId;
        return this.product_id;
    }

    static async getAll() {
        const sql = 'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCount() {
        const sql = 'SELECT COUNT(*) AS row_count FROM products';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getSingleById(id) {
        const sql =
            `SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id WHERE product_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async checkQuantities(products) {
        if (!Array.isArray(products) || products.length === 0) {
            throw new Error('Invalid products array');
        }

        const productIds = products.map(product => product.product_id);

        // Create placeholders for each product ID in the SQL query
        const placeholders = productIds.map(() => '?').join(',');

        // SQL query to fetch product quantities from the database
        const sql = `SELECT product_id, quantity FROM products WHERE product_id IN (${placeholders})`;

        try {
            // Execute SQL query with product IDs as parameters
            const [rows] = await pool.execute(sql, productIds);

            // Map rows to an object for easy access by product_id
            const dbQuantities = rows.reduce((acc, row) => {
                acc[row.product_id] = row.quantity;
                return acc;
            }, {});

            // Array to hold products with insufficient quantities
            const insufficientProducts = [];

            // Check each product's requested quantity against the database quantity
            for (const product of products) {
                const availableQuantity = dbQuantities[product.product_id] || 0;
                if (product.quantity > availableQuantity) {
                    insufficientProducts.push({
                        id: product.product_id,
                        requested: product.quantity,
                        available: availableQuantity,
                    });
                }
            }

            // Return the result
            if (insufficientProducts.length > 0) {
                return {
                    success: false,
                    message: 'Some products have insufficient quantities.',
                    insufficientProducts,
                };
            }

            return { success: true, message: 'All product quantities are sufficient.' };
        } catch (error) {
            throw new Error('Failed to check product quantities.');
        }
    }

    async updateById(id) {
        const sql = `UPDATE products SET 
        category_id = ?,
        articelNumber = ?,
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
            this.articelNumber,
            this.image,
            this.name,
            this.description,
            this.price,
            this.discount,
            this.quantity,
            this.available,
            id,
        ];
        const [rows] = await pool.execute(sql, values);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM products WHERE product_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getPaginated(page, pageSize) {
        const offset = (page - 1) * pageSize;
        const sql =
            'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id ORDER BY products.product_id LIMIT ? OFFSET ?';
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
        const sql = `SELECT * FROM products WHERE product_id IN (${placeholders})`;
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
        products.image,
        products.description,
        products.discount,
        products.articelNumber,
        categories.category_name,
        SUM(order_items.quantity) AS quantity
        FROM 
        order_items
        INNER JOIN 
        products 
        ON 
        products.product_id = order_items.product_id
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

    static async getRandomProducts(filterIds = []) {
        // Step 1: Select 5 random categories
        const randomCategoriesSql = `
            SELECT category_id
            FROM categories
            ORDER BY RAND()
            LIMIT 5;
        `;

        const [randomCategories] = await pool.execute(randomCategoriesSql);
        const categoryIds = randomCategories.map(row => row.category_id);
        let allProducts = [];

        // Step 2: Fetch up to 10 products for each of the selected categories
        for (const categoryId of categoryIds) {
            // Construct the NOT IN clause only if filterIds is provided and not empty
            const excludeCondition = filterIds.length > 0
                ? `AND p.product_id NOT IN (${filterIds.map(() => '?').join(',')})`
                : '';

            const productsSql = `
                SELECT p.*, c.*
                FROM products p
                INNER JOIN categories c ON p.category_id = c.category_id
                WHERE c.category_id = ?
                ${excludeCondition}
                LIMIT 10;
            `;
            // Combine categoryId and filterIds into query parameters
            const queryParams = [categoryId, ...filterIds];
            // Execute the query with the constructed SQL and parameters
            const [products] = await pool.execute(productsSql, queryParams);
            allProducts = allProducts.concat(products);
        }
        return allProducts;
    }

    static async getByQuantity() {
        const sql =
            'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id WHERE products.quantity <= 10 AND products.quantity > 0';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByUnAvailable() {
        const sql =
            'SELECT * FROM products INNER JOIN categories ON products.category_id = categories.category_id WHERE available = 0';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getProductsMultiFilter(key, value) {
        let sql;

        if (key === 'name') {
            sql = `
                SELECT * FROM products 
                INNER JOIN categories ON products.category_id = categories.category_id 
                WHERE products.name LIKE '${`%${value}%`}'
            `;
        } else {
            sql = `
                SELECT * FROM products 
                INNER JOIN categories ON products.category_id = categories.category_id 
                WHERE products.${key} = '${value}'
            `;
        }

        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getSpecificFields() {
        const idsAlreadyExists = await TopProduct.getIds();

        // Extract the product IDs from the idsAlreadyExists array
        const existingIds = idsAlreadyExists.map(item => item.product_id);

        // Check if there are any existing IDs to filter
        let sql = `SELECT product_id as value, CONCAT(name, ' - ', articelNumber) as label FROM products`;

        if (existingIds.length > 0) {
            // Create a SQL query that excludes the existing IDs
            sql += ` WHERE product_id NOT IN (${existingIds.join(',')})`;
        }

        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Product;
