const { pool, sequelize } = require('../databases/mysql.db');

class Product {
    constructor(options) {
        this.category_id = options.category_id;
        this.discount_id = options.discount_id || null;
        this.unit_id = options.unit_id;
        this.articelNumber = options.articelNumber;
        this.image = options.image;
        this.name = options.name;
        this.description = options.description;
        this.price = options.price;
        this.quantity = options.quantity;
        this.available = options.available;
    }

    async save() {
        const sql = `INSERT INTO products (
            category_id,
            discount_id,
            unit_id,
            articelNumber,
            image,
            name,
            description,
            price,
            quantity,
            available
        ) VALUES (
           ${this.category_id}, 
           ${this.discount_id}, 
           ${this.unit_id}, 
           ${this.articelNumber}, 
            '${this.image}', 
            "${this.name}",
            "${this.description}", 
            ${this.price},
            ${this.quantity},
            ${this.available}
        )`;
        const result = await pool.execute(sql);
        this.product_id = result[0].insertId;
        return this.product_id;
    }

    static async getAll() {
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name, 
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                 `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCount() {
        const sql = 'SELECT COUNT(*) AS row_count FROM products';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getQuantity(product_id, transaction) {
        const sql = `
            SELECT quantity
            FROM products
            WHERE product_id = ?
        `;

        let rows;
        if (transaction) {
            rows = await sequelize.query(sql, {
                replacements: [product_id],
                transaction,
            });
        } else {
            rows = await pool.execute(sql, [product_id]);
        }

        return rows[0];
    }

    static async updateProduct(product_id, key, value, transaction) {
        let sql = `
            UPDATE products
            SET ${key} = ?
            WHERE product_id = ?
        `;

        if (key === 'quantity') {
            sql = `
                UPDATE products
                SET ${key} = ${key} - ?
                WHERE product_id = ?
            `;
        }

        if (transaction) {
            await sequelize.query(sql, {
                replacements: [value, product_id],
                transaction: transaction,
            });
        } else {
            await pool.execute(sql, [value, product_id]);
        }
    }

    static async getSingleById(id) {
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                 WHERE products.product_id = "${id}"`;
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
        const sql = `SELECT product_id, quantity, available FROM products WHERE product_id IN (${placeholders})`;

        try {
            // Execute SQL query with product IDs as parameters
            const [rows] = await pool.execute(sql, productIds);

            // Map rows to an object for easy access by product_id
            const dbQuantities = rows.reduce((acc, row) => {
                acc[row.product_id] = { quantity: row.quantity, available: row.available };
                return acc;
            }, {});

            // Array to hold products with insufficient quantities
            const insufficientProducts = [];

            // Check each product's requested quantity against the database quantity
            for (const product of products) {
                const isAvailable = +dbQuantities[product.product_id].available || false;
                const availableQuantity = dbQuantities[product.product_id].quantity || 0;
                if ((product.quantity > availableQuantity) || !isAvailable) {
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
        } catch {
            throw new Error('Failed to check product quantities.');
        }
    }

    async updateById(id) {
        const sql = `UPDATE products SET 
        category_id = ?,
        unit_id = ?,
        articelNumber = ?,
        image = ?,
        name = ?,
        description = ?,
        price = ?,
        quantity = ?,
        available = ?
        WHERE product_id = ?`;
        const values = [
            this.category_id,
            this.unit_id,
            this.articelNumber,
            this.image,
            this.name,
            this.description,
            this.price,
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
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                 ORDER BY products.product_id LIMIT ? OFFSET ?`;
        const [rows] = await pool.execute(sql, [pageSize, offset]);
        return rows;
    }

    static async filterByName(searchTerm) {
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id 
                 WHERE products.name LIKE ?`;
        const [rows] = await pool.execute(sql, [`%${searchTerm}%`]);
        return rows;
    }

    static async getProductByFilter(key, value) {
        const sql = `
                SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id 
                WHERE products.${key} = '${value}'
            `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getMulti(productIds) {
        if (!Array.isArray(productIds) || productIds.length === 0) {
            throw new Error('Invalid product IDs array');
        }

        // Create placeholders for each product ID in the SQL query
        const placeholders = productIds.map(() => '?').join(',');

        // SQL query with placeholders for product IDs
        const sql = `
        SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id 
        WHERE product_id IN (${placeholders})`;
        try {
            //   Execute SQL query with product IDs as parameters
            const [rows] = await pool.execute(sql, productIds);
            return rows;
        } catch {
            throw new Error('Failed to check product quantities.');
        }
    }

    static async getPopular(limit) {
        const sql = `SELECT 
        order_items.product_id,
        units.unit_id,
        units.unit_name,
        products.name,
        products.price,
        products.image,
        products.available,
        products.description,
        discounts.discount_value As discount,
        products.articelNumber,
        categories.category_name,
        SUM(order_items.quantity) AS quantity
        FROM 
        order_items
        INNER JOIN products ON products.product_id = order_items.product_id
        INNER JOIN categories ON products.category_id = categories.category_id
        INNER JOIN units ON products.unit_id = units.unit_id
        LEFT JOIN discounts ON products.discount_id = discounts.discount_id
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
        c.category_name,
        d.discount_value AS discount,
        u.unit_name
        FROM 
        products p
        INNER JOIN categories c ON p.category_id = c.category_id
        INNER JOIN units u ON p.unit_id = u.unit_id
        LEFT JOIN discounts d ON p.discount_id = d.discount_id
        WHERE p.price BETWEEN ? AND ?`;

        try {
            const [rows] = await pool.execute(sql, [minPrice, maxPrice]);
            return rows;
        } catch {
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
                SELECT p.*, c.*, d.discount_value AS discount, u.unit_name
                FROM products p
                INNER JOIN categories c ON p.category_id = c.category_id
                INNER JOIN units u ON p.unit_id = u.unit_id
                LEFT JOIN discounts d ON p.discount_id = d.discount_id
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
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id             
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
            WHERE products.quantity <= 10 AND products.quantity > 0`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getByUnAvailable() {
        const sql = `SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name,
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id                             
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id 
            WHERE available = 0`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getProductsMultiFilter(key, value) {
        let sql;

        if (key === 'name') {
            sql = `
                 SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id,
                 units.unit_id,
                 unit_name, 
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id                                          
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                WHERE products.name LIKE '${`%${value}%`}'
            `;
        } else {
            sql = `
                 SELECT 
                 product_id, 
                 categories.category_id, 
                 discounts.discount_id,
                 units.unit_id,
                 unit_name, 
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id                                                     
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                WHERE products.${key} = '${value}'
            `;
        }

        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getSpecificForTopProduct() {
        const TopProduct = require('./topProducts.model');
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

    static async getSpecificForDiscount() {
        const sql = `SELECT 
        product_id as value, CONCAT(name, ' - ', articelNumber) as label 
        FROM products 
        WHERE discount_id IS null
        `;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getProductsByDiscountId(discountId) {
        const sql = `SELECT 
          products.product_id,
          products.category_id,
          products.discount_id,
          products.unit_id,
          units.unit_name,
          products.articelNumber,
          products.name,
          products.price,
          products.quantity,
          discounts.discount_value As discount,
          DATE_FORMAT(discounts.start_date, "%Y-%m-%d") As start_date,
          DATE_FORMAT(discounts.end_date, "%Y-%m-%d") As end_date
          FROM products
          INNER JOIN discounts ON products.discount_id = discounts.discount_id
          INNER JOIN units ON products.unit_id = units.unit_id 
          WHERE products.discount_id =?`;
        const [rows] = await pool.execute(sql, [discountId]);
        return rows;
    }

    static async getProductCountByCategory() {
        const sql = `SELECT c.category_name, COUNT(*) AS product_count
              FROM products AS p
              INNER JOIN categories AS c ON p.category_id = c.category_id
              GROUP BY p.category_id;`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async deleteProductDiscountId(productId) {
        const sql = `UPDATE products SET discount_id = NULL WHERE product_id = ?`;
        const [rows] = await pool.execute(sql, [productId]);
        return rows;
    }

    static async updateProductDiscountId(discountId, product_id, category_id) {
        let productIds = [];

        if (category_id && (!product_id || product_id.length === 0)) {
            const sql = `
            UPDATE products
            SET discount_id = ?
            WHERE category_id  = ?
          `;

            const [result] = await pool.execute(sql, [discountId, category_id]);

            return result;
        } else if ((Array.isArray(product_id) && product_id.length > 0) && !category_id) {
            productIds = product_id;

            const placeholders = productIds.map(() => '?').join(',');

            const sql = `
            UPDATE products
            SET discount_id = ?
            WHERE product_id IN (${placeholders})
        `;
            const [result] = await pool.execute(sql, [discountId, ...productIds]);

            return result;
        }
    }

    static async getAllAsChioceType() {
        const sql = `SELECT 
                 product_id as value, 
                 CONCAT(name,'-',articelNumber) as label, 
                 categories.category_id, 
                 discounts.discount_id, 
                 units.unit_id,
                 unit_name, 
                 articelNumber, 
                 image,
                 name, 
                 description,
                 price, 
                 quantity, 
                 available,
                 category_name,
                 product_id,
                 discounts.discount_value As discount
                 FROM products 
                 INNER JOIN categories ON products.category_id = categories.category_id
                 INNER JOIN units ON products.unit_id = units.unit_id
                 LEFT JOIN discounts ON products.discount_id = discounts.discount_id
                 `;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Product;
