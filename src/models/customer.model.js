const pool = require('../databases/mysql.db');

class User {
    constructor(options) {
        this.fname = options.fname;
        this.lname = options.lname;
        this.email = options.email;
        this.password = options.password || '';
        this.address = options.address || '';
        this.zip = options.zip || '';
        this.city = options.city || '';
        this.phone = options.phone || '';
        this.registered = options.registered || false;
    }
    async createUser() {
        const sql = `INSERT INTO customers (
            fname,
            lname,
            email,
            password,
            address,
            zip,
            city,
            phone,
            registered
        ) VALUES (
            "${this.fname}", 
            "${this.lname}",
            "${this.email}", 
            "${this.password}",
            "${this.address}",
            "${this.zip}",
            "${this.city}",
            "${this.phone}",
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
        const sql = `
            UPDATE customers SET 
            fname = ?, 
            lname = ?, 
            email = ?, 
            password = ?, 
            address = ?,
            zip = ?, 
            city = ?, 
            phone = ?, 
            registered = ?
            WHERE customer_id = ?`;
        const values = [
            this.fname,
            this.lname,
            this.email,
            this.password,
            this.address,
            this.zip,
            this.city,
            this.phone,
            this.registered,
            id,
        ];

        try {
            await pool.execute(sql, values);
        } catch (error) {
            throw error;
        }
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
    static async checkIfUserExisted(email) {
        const sql = `SELECT * FROM customers WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
    }
    static async checkUserUpdate(email, id) {
        const sql = `SELECT * FROM customers WHERE 
            (email = '${email}') 
            AND NOT customer_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async findByVerificationToken(token) {
        const sql = `SELECT * FROM customers WHERE verificationToken = "${token}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = User;
