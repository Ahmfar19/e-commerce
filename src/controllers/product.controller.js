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
const saveImagesToFolder = (files, uploadPath) => {
    return files.map((file) => {
        const fileName = file.originalname;
        const filePath = path.join(uploadPath, fileName);
        fs.writeFileSync(filePath, fileName); // Save file to folder
        return fileName;
    });
};
const createProduct = async (req, res) => {
    try {
        const { category_id, title, description, price, stock } = req.body;

        const product = new Product({
            category_id,
            title,
            description,
            price,
            stock,
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
const getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const getProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const singleProduct = await Product.getSingleById(id);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved the single product.', null, singleProduct);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};
const updateProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const product = new Product(req.body);

        const data = await product.updateById(id);

        if (data.affectedRows === 0) {
            return res.json({
                status: 404,
                statusCode: 'Bad Request',
                message: 'No product found for update',
            });
        }

        sendResponse(res, 202, 'Accepted', 'Successfully updated a product.', null, product);
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
        sendResponse(res, 202, 'Accepted', 'Successfully deleted a product.', null, null);
    } catch (err) {
        sendResponse(res, 500, 'Internal Server Error', null, err.message || err, null);
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
};
