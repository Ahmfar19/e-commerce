const pool = require('../databases/mysql.db');

class User {
    constructor(options) {
        this.username = options.username;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.email = options.email;
        this.password = options.password || '';
        this.address = options.address;
        this.phone = options.phone;
        this.personal_number = options.personal_number;
        this.registered = options.registered;
    }
    async createUser() {
        const sql = `INSERT INTO customers (
            username,
            first_name,
            last_name,
            email,
            password,
            address,
            phone,
            personal_number,
            registered
        ) VALUES (
            "${this.username}", 
            "${this.first_name}", 
            "${this.last_name}",
            "${this.email}", 
            "${this.password}",
            "${this.address}",
            ${this.phone},
            "${this.personal_number}",
            ${this.registered}
        )`;
        const result = await pool.execute(sql);
        this.customer_id = result[0].insertId;
        return this.customer_id;
    }
    static async getAllUsers() {
        const sql = 'SELECT * FROM customers';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getUserById(id) {
        const sql = `SELECT * FROM customers WHERE customer_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateUser(id) {
        const sql = `UPDATE customers SET 
        username = "${this.username}", 
        first_name = "${this.first_name}",
        last_name = "${this.last_name}", 
        email = "${this.email}",
        password = "${this.password}",
        address = "${this.address}",
        phone = ${this.phone},
        personal_number = "${this.personal_number}",
        registered = ${this.registered}
        WHERE customer_id = ${id}`;
        await pool.execute(sql);
    }
    static async updatePassword(id, newPassword) {
        const sql = `UPDATE customers SET 
        password = "${newPassword}"
        WHERE customer_id = ${id}`;
        await pool.execute(sql);
    }
    static async deleteUser(id) {
        const sql = `DELETE FROM customers WHERE customer_id = "${id}"`;
        await pool.execute(sql);
    }
    static async loginUser(email) {
        const sql = `SELECT * FROM customers WHERE email ="${email}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async checkIfUserExisted(email, username) {
        const sql = `SELECT * FROM customers WHERE email = ? OR username = ?`;
        const [rows] = await pool.execute(sql, [email, username]);
        return rows;
    }
    static async checkUserUpdate(username, email, id) {
        const sql = `SELECT * FROM customers WHERE 
            (username = '${username}' OR email = '${email}') 
            AND NOT customer_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = User;
