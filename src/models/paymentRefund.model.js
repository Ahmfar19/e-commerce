// paymentRefund.model.js

const { pool, sequelize } = require('../databases/mysql.db');

class PaymentRefund {
    constructor(options) {
        this.order_id = options.order_id;
        this.status = options.status;
        this.refund_id = options.refund_id;
        this.amount = options.amount;
    }

    async save(transaction) {
        const sql = `INSERT INTO payment_refund (
                order_id,
                status,
                refund_id,
                amount
            ) VALUES (?, ?, ?, ?)`;

        const values = [this.order_id, this.status, this.refund_id, this.amount];

        let result;
        if (transaction) {
            result = await sequelize.query(sql, { replacements: values, transaction });
        } else {
            result = await pool.execute(sql, values);
        }
        if (transaction) {
            return result[0];
        } else {
            return result[0].insertId;
        }
    }

    static async getAll() {
        const sql = 'SELECT * FROM payment_refund';
        const [rows] = await pool.execute(sql);
        return rows;
    }

    static async getById(id) {
        const sql = `SELECT * FROM payment_refund WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows[0];
    }

    static async getByRefundId(id) {
        const sql = `SELECT * FROM payment_refund WHERE refund_id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    static async updateStatusByRefundId(options) {
        const sql = `UPDATE payment_refund SET 
            status = ?
            WHERE refund_id = ?`;

        const params = [
            options.status,
            options.refund_id,
        ];

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    async updateById(id) {
        const sql = `UPDATE payment_refund SET 
            order_id = ?,
            status = ?,
            refund_id = ?, 
            amount = ?
            WHERE id = ?`;

        const params = [
            this.order_id,
            this.status,
            this.refund_id,
            this.amount,
            id,
        ];

        const [rows] = await pool.execute(sql, params);
        return rows;
    }

    static async deleteById(id) {
        const sql = `DELETE FROM payment_refund WHERE id = ?`;
        const [rows] = await pool.execute(sql, [id]);
        return rows;
    }

    // New Method to Sum Amount by Order ID
    static async sumAmountByOrderId(order_id) {
        const sql = `SELECT SUM(amount) AS totalAmount FROM payment_refund WHERE order_id = ?`;
        const [rows] = await pool.execute(sql, [order_id]);
        return rows[0].totalAmount || 0; // Return 0 if no refunds found
    }
}

module.exports = PaymentRefund;
