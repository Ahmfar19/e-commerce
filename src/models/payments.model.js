const { pool } = require('../databases/mysql.db');

class Payments {
    constructor(options) {
        this.payment_id = options.payment_id || null;
        this.payment_type_id = options.payment_type_id;
        this.customer_id = options.customer_id;
        this.order_id = options.order_id;
        this.payment_id = options.payment_id;
        this.status = options.status || 1;
    }

    async createPayment() {
        const sql = `
            INSERT INTO payments (
                payment_type_id,
                customer_id,
                order_id,
                payment_id,
                status
            ) VALUES (
                ${this.payment_type_id},
                ${this.customer_id},
                ${this.order_id},
                "${this.payment_id}",
                ${this.status}
            )`;
        const [result] = await pool.execute(sql);
        this.payment_id = result.insertId;
        return this.payment_id;
    }

    static async getAllPaymentss() {
        const sql = `
            SELECT
                payment_id,
                payment_type_id,
                customer_id,
                order_id,
                payment_id,
                status,
                created_at,
                updated_at
            FROM payments`;
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getPaymentsById(id) {
        const sql = `SELECT * FROM payments WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async getPaymentsByPaymentId(payment_id) {
        const sql = `SELECT * FROM payments WHERE payment_id = ?`;
        const [rows] = await pool.execute(sql, [payment_id]);
        return rows;
    }

    static async updatePaymentsStatus(payment_id, status_id) {
        const sql = `UPDATE payments SET status = ? WHERE payment_id = ?`;
        await pool.execute(sql, [status_id, payment_id]);
        const [rows] = await this.getPaymentsByPaymentId(payment_id);
        return rows;
    }

    async updatePayments(id) {
        const sql = `
            UPDATE payments SET 
            payment_type_id = ?, 
            customer_id = ?, 
            order_id = ?, 
            payment_id = ?, 
            status = ? 
            WHERE payment_id = ?`;
        const values = [
            this.payment_type_id,
            this.customer_id,
            this.order_id,
            this.payment_id,
            this.status,
            id,
        ];
        await pool.execute(sql, values);
    }

    static async deletePayments(id) {
        const sql = `DELETE FROM payments WHERE id = ?`;
        await pool.execute(sql, [id]);
    }

    static async getPaymentssByStatus(status) {
        const sql = `SELECT * FROM payments WHERE status = ?`;
        const [rows] = await pool.execute(sql, [status]);
        return rows;
    }

    static async getPaymentssByCustomerId(customerId) {
        const sql = `SELECT * FROM payments WHERE customer_id = ?`;
        const [rows] = await pool.execute(sql, [customerId]);
        return rows;
    }
}

module.exports = Payments;
