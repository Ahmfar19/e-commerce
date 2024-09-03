const { pool, sequelize } = require('../databases/mysql.db');

class Payments {
    constructor(options) {
        this.payment_id = options.payment_id || null;
        this.payment_type_id = options.payment_type_id;
        this.customer_id = options.customer_id;
        this.order_id = options.order_id;
        this.payment_id = options.payment_id;
        this.payment_reference = options.payment_reference;
        this.status = options.status || 1;
    }

    async createPayment(transaction) {
        const sql = `
            INSERT INTO payments (
                payment_type_id,
                customer_id,
                order_id,
                payment_id,
                payment_reference,
                status
            ) VALUES (
                ${this.payment_type_id},
                ${this.customer_id},
                ${this.order_id},
                "${this.payment_id}",
                "${this.payment_reference}",
                ${this.status}
        )`;

        const result = transaction ? await sequelize.query(sql, { transaction }) : await pool.execute(sql);
        if (transaction) {
            this.payment_id = result[0]; // Adjust based on Sequelize version
        } else {
            this.payment_id = result[0].insertId;
        }
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
                payment_reference,
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

    static async updatePaymentsStatusAndPaymentId(data) {
        const sql = `
            UPDATE payments SET 
            payment_id = ?, 
            status = ? 
            WHERE id = ?`;
        const values = [
            data.payment_id,
            data.status,
            data.id,
        ];
        const [rows] = await pool.execute(sql, values);
        return rows.affectedRows;
    }

    static async updatePaymentStatus(payment_id, status) {
        const sql = `
            UPDATE payments SET 
            status = ? 
            WHERE payment_id = ?`;

        const values = [status, payment_id];

        try {
            // Execute the SQL query to update the payment status
            await pool.execute(sql, values);
            return {
                success: true,
                message: 'Payment status updated successfully',
            };
        } catch (error) {
            return {
                success: false,
                message: 'Failed to update payment status',
            };
        }
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
