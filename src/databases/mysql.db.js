const mysql = require('mysql2/promise');
const config = require('config');
const { Sequelize } = require('sequelize');

const DB_HOST = config.get('DB_HOST');
// const DB_PORT = config.get('DB_PORT');
const DB_NAME = config.get('DB_NAME');
const DB_USERNAME = config.get('DB_USERNAME');
const DB_USERNAME_PASSWORD = config.get('DB_USERNAME_PASSWORD');

const connectionOptions = {
    host: DB_HOST,
    // port: DB_PORT,
    database: DB_NAME,
    user: DB_USERNAME,
    password: DB_USERNAME_PASSWORD,
    decimalNumbers: true,
};

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_USERNAME_PASSWORD, {
    host: DB_HOST,
    dialect: 'mysql', // or 'postgres', 'sqlite', etc.
    logging: false,
});

sequelize.authenticate().then(() => console.log('Database connected...')).catch(err => console.log('Error: ' + err));

const pool = mysql.createPool(connectionOptions);

const connectToMySQL = async () => {
    try {
        await pool.getConnection();

        console.error('MySQL database connected!');
    } catch {
        console.error('MySQL database connection error!');
        process.exit(1);
    }
};

connectToMySQL().then();

module.exports = {
    pool,
    connectionOptions,
    sequelize,
};
