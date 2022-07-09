'use strict';
const { Op } = require('sequelize');

const { Products, Categories, Brands, Images, Reviews } = require("../db.js");

class serviceProducts {
    constructor() {
        this.products = [];
    }

    async getAll(name, category) {

        try {
            if (name) {

                let response = await Products.findAll({
                    where: {
                        [Op.or]: [{
                                name: {
                                    [Op.iLike]: `%${name}%`
                                }
                            },
                            {
                                description: {
                                    [Op.iLike]: `%${name}%`
                                }
                            }
                        ]
                    },
                });
                return response;
            }

            if (category) {
                const productsByCategory = await Categories.findOne({
                    where: {
                        name: category
                    },
                    include: [Products]
                })
                return productsByCategory.products;
            }

            return await Products.findAll({
                attributes: ['id', 'name', 'description', 'technical_especification', 'price', 'stock', 'brandId'],
                include: [{
                        model: Categories,
                        attributes: ['name']
                    },
                    {
                        model: Brands,
                        attributes: ['name']
                    },
                    {
                        model: Images,
                        attributes: ['url_image']
                    }
                ]
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            let product = await Products.findByPk(id, {
                include: [Categories, Brands, Images, Reviews] //Falta incluir Reviews
            });
            if (!product) {
                throw { error: "Product not found" }
            }
            return product
        } catch (error) {
            return error;
        }

    }

    async create(product) {
        const { name, description, technical_especification, price, stock, categories, images, brand } = product;
        try {
            if (!name || !description || !technical_especification || !price || !stock || !categories) {
                throw 'Name, Description, Thecnical Description, Price, Stock and Categories are requerid fields.';
            }

            if (parseFloat(price) <= 0) {
                throw 'Price must be greater than 0';
            }

            if (parseInt(stock) < 0) {
                throw 'Stock must be greater than or equal to 0';
            }

            if (!categories || !Array.isArray(categories)) { // check that categories is not null and check is an array
                throw 'The product must have at least one Category ';
            }


            let brandFounded = await Brands.findOne({
                where: { name: brand }
            });
            console.log(brandFounded.dataValues.id);

            const regProduct = {
                name,
                description,
                technical_especification,
                price,
                stock,
                brandId: brandFounded.dataValues.id
            }

            const newProduct = await Products.create(regProduct);

            const categoriesPromises = categories.map(async(cat) => {
                let category = await Categories.findAll({
                    where: { name: cat.name }
                });

                return newProduct.setCategories(category); //la asociacion la realiza como objeto
            });

            const imagesPromises = images.map(async(img) => {
                let image = await Images.findAll({
                    where: { url_image: img }
                });

                return newProduct.setImages(image); //la asociacion la realiza como objeto
            });


            await Promise.all(categoriesPromises, imagesPromises);

            return { msg: 'The products was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, product) {
        try {
            let response = await Products.update(product, {
                where: {
                    id: id
                }
            });
            if (response[0] === 0) {
                throw { error: "Product not found" };
            }
            if (response[0] === 1) {
                return { msg: "Update Product sucessufully" }
            }
        } catch (error) {
            return error;
        };
    }

    async delete(id) {
        try {
            let response = await Products.destroy({
                where: {
                    id: id
                }
            });
            console.log(response);
            if (response === 0) {
                throw { error: "Product not found" };
            }
            if (response === 1) {
                return { msg: "Delete Product sucessufully" }
            }
        } catch (error) {
            return error;
        };
    };
}


module.exports = serviceProducts;