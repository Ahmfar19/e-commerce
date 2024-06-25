const bcrypt = require('bcryptjs');

async function hashPassword(password) {
    // Number of salt rounds (the higher, the more secure but slower)
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return { success: true, data: hashedPassword };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

function getNowDate_time() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // Adding 1 to match SQL month format
    const day = currentDate.getDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();
    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

function tokenExpireDate() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);  

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0'); 
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0'); 
    const minutes = String(currentDate.getMinutes()).padStart(2, '0'); 
    const seconds = String(currentDate.getSeconds()).padStart(2, '0'); 

    const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}

module.exports = {
    hashPassword,
    comparePassword,
    getNowDate_time,
    tokenExpireDate
};
