const pool = require('../databases/mysql.db');

class Staff {
    constructor(options) {
        this.username = options.username;
        this.fname = options.fname;
        this.lname = options.lname;
        this.phone = options.phone;
        this.email = options.email;
        this.password = options.password;
    }
    async save() {
        const sql = `INSERT INTO staff (
            username,
            fname,
            lname,
            phone,
            email,
            password
        ) VALUES (
            "${this.username}", 
            "${this.fname}", 
            "${this.lname}",
             ${this.phone}, 
            "${this.email}",
            "${this.password}"
        )`;
        const result = await pool.execute(sql);
        this.staff_id = result[0].insertId;
        return this.staff_id;
    }
    static async getAll() {
        const sql = 'SELECT * FROM staff';
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async getStaffById(id) {
        const sql = `SELECT * FROM staff WHERE staff_id = "${id}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    async updateStaff(id) {
        const sql = `
            UPDATE staff SET 
            username = ?,
            fname = ?, 
            lname = ?, 
            phone = ?, 
            email = ?
            WHERE staff_id = ?`;
        const values = [
            this.username,
            this.fname,
            this.lname,
            this.phone,
            this.email,
            id,
        ];

        try {
            await pool.execute(sql, values);
        } catch (error) {
            throw error;
        }
    }
    static async updatePassword(id, newPassword) {
        const sql = `UPDATE staff SET 
        password = "${newPassword}"
        WHERE staff_id = ${id}`;
        await pool.execute(sql);
    }
    static async delete(id) {
        const sql = `DELETE FROM staff WHERE staff_id = "${id}"`;
        await pool.execute(sql);
    }
    static async loginUser(email_username) {
        const sql = `SELECT * FROM staff WHERE email ="${email_username}" OR username="${email_username}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async checkIfUserExisted(email, username) {
        const sql = `SELECT * FROM staff WHERE email = ? OR username = ?`;
        const [rows] = await pool.execute(sql, [email, username]);
        return rows;
    }
    static async checkUserUpdate(email, id) {
        const sql = `SELECT * FROM staff WHERE 
            (email = '${email}') 
            AND NOT staff_id = ${id}`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
    static async findByVerificationToken(token) {
        const sql = `SELECT * FROM customers WHERE verificationToken = "${token}"`;
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = Staff;
