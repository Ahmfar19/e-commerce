module.exports = {
    PORT: process.env.PORT || 80,
    DB_HOST: process.env.DB_HOST || 'localhost',
    // DB_PORT: process.env.DB_PORT || '80',
    DB_USERNAME: process.env.DB_USERNAME || 'root',
    DB_USERNAME_PASSWORD: process.env.DB_USERNAME_PASSWORD || '',
    DB_NAME: process.env.DB_NAME || 'ecommerce',
    EMAIL_HOST : process.env.EMAIL_HOST,
    EMAIL : process.env.EMAIL,
    EMAIL_PASS : process.env.EMAIL_PASS ,
};


