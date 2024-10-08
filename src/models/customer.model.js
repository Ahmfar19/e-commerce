const { pool } = require('../databases/mysql.db');
const Joi = require('joi');

const userSchema = Joi.object({
    fname: Joi.string().trim().min(1).max(50).required().messages({
        'string.base': 'ec_validation_customer_fname_beString',
        'string.empty': 'ec_validation_customer_fname_cantBeEmpty',
        'string.min': 'ec_validation_customer_fname_minlength',
        'string.max': 'ec_validation_customer_fname_maxlength',
        'any.required': 'ec_validation_customer_fname_requierd',
    }),
    lname: Joi.string().trim().min(1).max(50).required().messages({
        'string.base': 'ec_validation_customer_lname_mustBeString',
        'string.empty': 'ec_validation_customer_lname_cantBeEmpty',
        'string.min': 'ec_validation_customer_lname_minlength',
        'string.max': 'ec_validation_customer_lname_maxlength',
        'any.required': 'ec_validation_customer_lname_requierd',
    }),
    email: Joi.string().trim().email().required().messages({
        'string.base': 'ec_validation_customer_email_mustBeString',
        'string.empty': 'ec_validation_customer_email_cantBeEmpty',
        'string.email': 'ec_validation_customer_email_mustTypeEmail',
        'any.required': 'ec_validation_customer_email_requierd',
    }),
    password: Joi.string().allow('').messages({
        'any.required': 'ec_validation_customer_password_required',
    }),
    address: Joi.string().trim().max(255).allow('').messages({
        'string.base': 'ec_validation_customer_address_mustBeString',
        'string.max': 'ec_validation_customer_address_maxlength',
    }),
    zip: Joi.string().trim().max(5).allow('').messages({
        'string.base': 'ec_validation_customer_zip_mustBeString',
        'string.max': 'ec_validation_customer_zip_maxlength',
    }),
    city: Joi.string().trim().max(100).allow('').messages({
        'string.base': 'ec_validation_customer_city_mustBeString',
        'string.max': 'ec_validation_customer_city_maxlength',
    }),
    phone: Joi.string().pattern(/^\+?[0-9]\d{1,14}$/).allow('').min(10).messages({
        'string.base': 'ec_validation_customer_phone_mustBeString',
        'string.min': 'ec_validation_customer_phone_minlength',
        'string.pattern.base': 'ec_validation_customer_phone_pattern',
    }),
    registered: Joi.alternatives().try(
        Joi.boolean(),
        Joi.number().valid(0, 1),
    ).optional().messages({
        'boolean.base': 'ec_validation_customer_registered_mustBeBoolean',
        'number.base': 'ec_validation_customer_registered_mustBeNumber',
        'number.only': 'ec_validation_customer_registered_mustBeZeroOrOne',
    }),
    isCompany: Joi.alternatives().try(
        Joi.boolean(),
        Joi.number().valid(0, 1),
    ).optional().default(0).messages({
        'boolean.base': 'ec_validation_customer_isCompany_mustBeBoolean',
        'number.base': 'ec_validation_customer_isCompany_mustBeNumber',
        'number.only': 'ec_validation_customer_isCompany_mustBeZeroOrOne',
    }),
});

class User {
    constructor(options) {
        const { error, value } = userSchema.validate(options);
        if (error) {
            throw new Error(`${error.details.map(err => err.message).join(', ')}`);
        }

        this.fname = value.fname;
        this.lname = value.lname;
        this.email = value.email;
        this.password = value.password || '';
        this.address = value.address || '';
        this.zip = value.zip || '';
        this.city = value.city || '';
        this.phone = value.phone || '';
        this.registered = value.registered || false;
        this.isCompany = value.isCompany;
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
            registered,
            isCompany
        ) VALUES (
            "${this.fname}", 
            "${this.lname}",
            "${this.email}", 
            "${this.password}",
            "${this.address}",
            "${this.zip}",
            "${this.city}",
            "${this.phone}",
            ${this.registered},
            ${this.isCompany}
        )`;
        const result = await pool.execute(sql);
        this.customer_id = result[0].insertId;
        return this.customer_id;
    }

    static async getAllUsers() {
        const sql = `SELECT
        	customer_id,
            	fname,
                lname,
                email,
                address,
                zip,
                city,
                phone,
                registered,
                isCompany
        FROM customers`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getCount() {
        const sql = 'SELECT COUNT(*) AS row_count FROM customers';
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
            address = ?,
            zip = ?, 
            city = ?, 
            phone = ?, 
            registered = ?,
            isCompany = ?
            WHERE customer_id = ?`;
        const values = [
            this.fname,
            this.lname,
            this.email,
            this.address,
            this.zip,
            this.city,
            this.phone,
            this.registered,
            this.isCompany,
            id,
        ];
        await pool.execute(sql, values);
    }

    static async isCustomerRegistered(email) {
        const sql = `SELECT * FROM customers WHERE email = ?`;
        const [rows] = await pool.execute(sql, [email]);
        return rows;
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

    static async getCustomerByFilter(key, value) {
        let sql;

        if (key === 'customerName') {
            sql = `
                SELECT 
                customer_id,
            	fname,
                lname,
                email,
                address,
                zip,
                city,
                phone,
                registered,
                isCompany
                FROM customers WHERE CONCAT(fname, ' ', lname) LIKE '${`%${value}%`}'
            `;
        } else {
            sql = `
                SELECT 
                customer_id,
            	fname,
                lname,
                email,
                address,
                zip,
                city,
                phone,
                registered,
                isCompany
                FROM customers WHERE ${key} = '${value}'
            `;
        }
        const [rows] = await pool.execute(sql);
        return rows;
    }
}

module.exports = User;
