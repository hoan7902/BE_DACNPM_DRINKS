const ProductModel = require('../models/ProductModel');
const UserModel = require('../models/UserModel');
class ProductController {
    //----------- create new product ------------------------------
    addProduct = async (req, res) => {
        try {
            const { name, description, price, typeId, image, userId } =
                req.body;
            const user = await UserModel.findById(userId);
            if (user && user.admin) {
                const newProduct = new ProductModel({
                    name,
                    description,
                    price,
                    typeId,
                    image,
                });
                await newProduct.save();
                const response = {
                    code: 201,
                    message: 'Create Product successfully',
                };
                res.status(200).send(response);
            } else {
                const response = {
                    code: 202,
                    message:
                        'Your account is not permissions to create this product',
                };
                res.status(200).send(response);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
    //--------- update product --------------------
    updateProduct = async (req, res) => {
        try {
            const {
                name,
                description,
                price,
                typeId,
                image,
                userId,
                productId,
            } = req.body;
            const user = await UserModel.findById(userId);
            const product = await ProductModel.findById(productId);
            if (user && user.admin) {
                await product.update({
                    ...product.toObject(),
                    name,
                    description,
                    price,
                    typeId,
                    image,
                });
                const response = {
                    code: 203,
                    message: 'Update Product successfully',
                };
                res.status(200).send(response);
            } else {
                const response = {
                    code: 204,
                    message:
                        'Your account is not permissions to update this product',
                };
                res.status(200).send(response);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    //--------- Delete Product --------------------------------

    deleteProduct = async (req, res) => {
        try {
            const { listProductId, userId } = req.body;
            const user = await UserModel.findById(userId);
            if (user && user.admin) {
                if (listProductId.length > 0) {
                    const listPrise = listProductId.map((item) =>
                        ProductModel.findByIdAndDelete(item)
                    );
                    await Promise.all(listPrise);
                    const response = {
                        code: 205,
                        message: 'Product deleted successfully',
                    };
                    res.status(200).send(response);
                }
            } else {
                const response = {
                    code: 206,
                    message:
                        'Your account is not permissions to delete  product',
                };
                res.status(200).send(response);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
    //--------- Get Product --------------------
    getProduct = async function (req, res) {
        try {
            let { typeId } = req.query;
            if (typeId) {
                const listProduct = await ProductModel.find({
                    typeId: typeId,
                }).select('name price image');
                if (listProduct.length) {
                    const dataRespone = {
                        listProduct: listProduct,
                    };
                    const response = {
                        code: 301,
                        message: 'Get list product successfully',
                        data: dataRespone,
                    };
                    res.status(200).send(response);
                } else {
                    const response = {
                        code: 302,
                        message: 'TypeId is not correct',
                    };
                    res.status(200).send(response);
                }
            } else {
                const listProduct = await ProductModel.find({}).select(
                    'name price image'
                );
                const dataRespone = {
                    listProduct: listProduct,
                };
                const response = {
                    code: 301,
                    message: 'Get list product successfully',
                    data: dataRespone,
                };
                res.status(200).send(response);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
    //--------- Get detail product --------------------
    getProductDetail = async function (req, res) {
        try {
            let { productId } = req.query;
            const productDetail = await ProductModel.findById(productId).select(
                'name price image typeId description'
            );
            if (productDetail) {
                const dataRespone = {
                    productDetail: productDetail,
                };
                const response = {
                    code: 303,
                    message: 'Get product detail successfully',
                    data: dataRespone,
                };
                res.status(200).send(response);
            } else {
                const response = {
                    code: 304,
                    message: 'ProductId is not correct',
                };
                res.status(200).send(response);
            }
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = new ProductController();
