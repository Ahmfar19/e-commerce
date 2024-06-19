const Product = require('../models/product.model');
const { sendResponse } = require('../helpers/apiResponse');
const path = require('path');
const fs = require('fs');

const createProductFolder = async (uploadPath, files, product, lastProduct) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(uploadPath, { recursive: true }, async (err) => {
            if (err) {
                reject(err);
            }
            if (files) {
                const images = await saveImagesToFolder(files, uploadPath);
                product.image = JSON.stringify(images);
                await product.updateById(lastProduct);
                resolve(product);
            }
        });
    });
};
const saveImagesToFolder = async (files, uploadPath) => {
    const savePromises = files.map(async (file) => {
        const fileName = file.originalname;
        const filePath = path.join(uploadPath, fileName);
        await fs.promises.writeFile(filePath, file.buffer);// Asynchronous file writing
        return fileName;
    });
    return Promise.all(savePromises);
};
const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, discount, quantity, available } = req.body;

        const product = new Product({
            category_id,
            name,
            description,
            price,
            discount,
            quantity,
            available,
        });

        const lastProduct = await product.save();

        const folderName = `product_${lastProduct}`;
        const uploadPath = path.join(__dirname, '../../assets/images', folderName);

        if (!fs.existsSync(uploadPath)) {
            const data = await createProductFolder(uploadPath, req.files, product, lastProduct);

            sendResponse(res, 201, 'Created', 'Successfully created a product.', null, data);
        } else {
            throw new Error(`Product_${lastProduct} already exists`);
        }
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.getSingleById(id);
        const folderName = `product_${id}`;
        const uploadPath = path.join(__dirname, '../../assets/images', folderName);

        if (fs.existsSync(uploadPath)) {
            const files = fs.readdirSync(uploadPath);
            const images = files.map((file) => {
                return `${folderName}/${file}`;
            });

            product[0].image = JSON.stringify(images);
        }
        sendResponse(res, 200, 'OK', 'Product retrieved successfully.', null, product);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const { category_id, name, description, price, discount, quantity, available } = req.body;

        // update product text only
        const product = new Product({
            category_id: category_id,
            name: name,
            description: description,
            price: price,
            discount: discount,
            quantity: quantity,
            available: available
        });

        const check = await product.updateById(id);

        if (check.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No product found for update',
            });
        }

        const folderName = `product_${id}`;
        const uploadPath = path.join(__dirname, '../../assets/images', folderName);

        // Handle image update
        if (req.files.length) {
            // Delete existing images
            if (fs.existsSync(uploadPath)) {
                const files = fs.readdirSync(uploadPath);
                files.forEach((file) => {
                    fs.unlinkSync(path.join(uploadPath, file));
                });
            }
        }

        const data = await createProductFolder(uploadPath, req.files, product, id);

        sendResponse(res, 202, 'Accepted', 'Successfully updated a product.', null, data);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await Product.deleteById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No product found for delete',
            });
        }

        const folderName = `product_${id}`;
        const uploadPath = path.join(__dirname, '../../assets/images', folderName);

        if (fs.existsSync(uploadPath)) {
            const files = fs.readdirSync(uploadPath);
            files.forEach((file) => {
                fs.unlinkSync(path.join(uploadPath, file));
            });
            fs.rmdirSync(uploadPath); // Delete the directory after removing files
        }

        sendResponse(res, 202, 'Accepted', 'Successfully deleted a product.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};
const getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getProductByCategoryId = async (req, res) => {
    try {
        const { categoryId } = req.params
        const products = await Product.getByCategory(categoryId);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
}

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts,
    getProductByCategoryId
};
