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
        await fs.promises.writeFile(filePath, file.buffer); // Asynchronous file writing
        return fileName;
    });
    return Promise.all(savePromises);
};

const createProduct = async (req, res) => {
    try {
        const { category_id, name, description, price, discount, total_quantity, available } = req.body;

        const product = new Product({
            category_id,
            name,
            description,
            price,
            discount,
            total_quantity,
            available,
        });

        const lastProduct = await product.save();

        const folderName = `product_${lastProduct}`;
        const uploadPath = path.join(__dirname, '../../public/images/', folderName);

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
        const uploadPath = path.join(__dirname, '../../public/images/', folderName);

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

        const { category_id, name, description, price, discount, total_quantity, available } = req.body;

        // update product text only
        const product = new Product({
            category_id: category_id,
            name: name,
            description: description,
            price: price,
            discount: discount,
            total_quantity: total_quantity,
            available: available,
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
        const uploadPath = path.join(__dirname, '../../public/images/', folderName);

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
        const uploadPath = path.join(__dirname, '../../public/images/', folderName);

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

const getProductsFilter = async (req, res) => {
    try {
        const { key, value } = req.query;
        const products = await Product.getProductByFilter(key, value);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getPaginatedProducts = async (req, res) => {
    const { page, pageSize } = req.query;
    try {
        const products = await Product.getPaginated(Number(page), Number(pageSize));
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const filterProductsByName = async (req, res) => {
    const { searchTerm } = req.query;
    try {
        const products = await Product.filterByName(searchTerm);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getMultiProducts = async (req, res) => {
    try {
        const { productIds } = req.body;
        const products = await Product.getMulti(productIds);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getPopularProducts = async (req, res) => {
    try {
        const { limit } = req.query;
        const parsedLimit = parseInt(limit, 10);
        if (isNaN(parsedLimit) || parsedLimit <= 0) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid limit  value.', null, null);
        }
        const popularProducts = await Product.getPopular(parsedLimit);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the popular products.', null, popularProducts);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

const getProductsByRangePrice = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.query;

        const min = parseFloat(minPrice);
        const max = parseFloat(maxPrice);

        if (isNaN(min) || isNaN(max)) {
            return sendResponse(res, 400, 'Bad Request', 'Invalid price range values.', null, null);
        }
        const products = await Product.filterByPriceRange(min, max);
        sendResponse(res, 200, 'Ok', 'Successfully retrieved all the popular products.', null, products);
    } catch (error) {
        sendResponse(res, 500, 'Internal Server Error', null, error.message || error, null);
    }
};

module.exports = {
    createProduct,
    updateProduct,
    getProduct,
    deleteProduct,
    getProducts,
    getPaginatedProducts,
    filterProductsByName,
    getProductsFilter,
    getMultiProducts,
    getPopularProducts,
    getProductsByRangePrice,
};
