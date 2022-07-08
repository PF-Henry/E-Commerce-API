'use strict';

const { Products, Categories, Brands, Images } = require("../db.js");

class serviceProducts {
    constructor() {
        this.products = [];
    }

    async getAll() {
        try {
            return await Products.findAll({
                include: [Categories, Brands, Images]
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        return await Products.findByPk(id);
    }

    async create(product) {
        const { name, description, technical_especification, price, stock, categories, images } = product;
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

            // images es un array de url de imagenes

            const regProduct = {
                name,
                description,
                technical_especification,
                price,
                stock
            }

            const newProduct = await Products.create(regProduct);

            const categoriesPromises = categories.map(async(cat) => {
                let category = await Categories.findAll({
                    where: { name: cat.name }
                });

                return newProduct.setCategories(category); //la asociacion la realiza como objeto
            });

            await Promise.all(categoriesPromises);

            return { msg: 'El producto fue creado con exito' };

        } catch (error) {
            return error;
        }
    }

    async update(id, product) {
        return await Products.update(product, {
            where: {
                id: id
            }
        });
    }

    async delete(id) {
        return await Products.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = serviceProducts;