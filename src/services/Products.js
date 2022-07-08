'use strict';

const { Products, Categories, Brands, Images, Reviews } = require("../db.js");

class serviceProducts {
    constructor() {
        this.products = [];
    }

    async getAll(name, category) {


        try {
            if (name) {
                return await Products.findAll({
                    where: {
                        name: {
                            [Op.like]: `%${name}%`
                        }
                    },
                });
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
        return await Products.findByPk(id, {
            include: [Categories, Brands, Images, Reviews] //Falta incluir Reviews
        });
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