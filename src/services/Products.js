'use strict';
const { Op } = require('sequelize');
const { Products, Categories, Brands, Images, Reviews } = require("../db.js");

// ---------------------------------- implementation upload ----------------------------------
const sharp = require('sharp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { dirname } = require('path');
// ---------------------------------- implementation upload ----------------------------------


const returnErrorMessage = require("../utils/msgErrors.js");
const { ARRAY } = require('sequelize');


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
                            },
                            {
                                technical_especification: {
                                    [Op.iLike]: `%${name}%`
                                }
                            }
                        ]
                    },
                    attributes: ['id', 'name', 'description', 'technical_especification', 'price', 'stock', 'brandId', 'state'],
                    include: [{
                            model: Categories,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Brands,
                            attributes: ['id', 'name']
                        },
                        {
                            model: Images,
                            attributes: ['id', 'url_image']
                        }
                    ]
                });
                if (response.length === 0) {
                    throw "Product not found";
                }
                return response;
            }

            if (category) {
                const productsByCategory = await Categories.findOne({
                    where: {
                        name: category
                    },
                    include: [{
                        model: Products,
                        attributes: ['id', 'name', 'description', 'technical_especification', 'price', 'stock', 'brandId', 'state'],
                        include: [{
                                model: Brands,
                                attributes: ['id', 'name']
                            },
                            {
                                model: Images,
                                attributes: ['id', 'url_image']
                            }
                        ]
                    }]
                })
                return productsByCategory.products;
            }

            return await Products.findAll({
                attributes: ['id', 'name', 'description', 'technical_especification', 'price', 'stock', 'brandId', 'state'],
                include: [{
                        model: Categories,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Brands,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Images,
                        attributes: ['id', 'url_image']
                    }
                ]
            });
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let product = await Products.findByPk(id, {
                include: [Categories, Brands, Images, Reviews] //Falta incluir Reviews
            });
            if (!product) {
                throw "Product not found";
            }
            return product
        } catch (error) {
            return returnErrorMessage(error)
        }

    }

    async create(product, req) {
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


            const arrayCategories = JSON.parse(categories);
            if (!arrayCategories || !Array.isArray(arrayCategories)) { // check that categories is not null and check is an array
                throw 'The product must have at least one Category ';
            }


            let brandFounded = await Brands.findOne({
                where: { name: brand }
            });



            const regProduct = {
                name,
                description,
                technical_especification,
                price,
                stock,
                brandId: brandFounded.dataValues.id,
                state: false,
            }


            const newProduct = await Products.create(regProduct);



            const categoriesPromises = arrayCategories.map(async(cat) => {
                let category = await Categories.findAll({
                    where: { name: cat.name }
                });
                return newProduct.setCategories(category); //la asociacion la realiza como objeto
            });

            await Promise.all(categoriesPromises);



            // ------------------------------------------- upload Images --------------------------------------------------
            const fileName = product.fileName;
            let arrBuffer = [];
            if (Array.isArray(fileName)) {
                arrBuffer = fileName.map((b64string) => {
                    const b64 = b64string.split(';base64,').pop();
                    return Buffer.from(b64, 'base64');
                });
            } else {
                const b642 = fileName.split(';base64,').pop();
                arrBuffer.push(Buffer.from(b642, 'base64'));
            }


            // obtener el nombre del servidor 
            //const serverName = process.env.SERVER_NAME;


            const protocol = req.protocol;
            const serverName = protocol + "://" + req.get("host") + "/api/";

            let arrayImages = []; // guarada los nombres de las imagenes para las url
            arrBuffer.forEach(async(buffer64, index) => {
                const uuid = uuidv4();
                const strFileName = uuid + ".png"; // nombre de la imgagen optimizada

                const urlImagen = serverName + "products/images/" + strFileName;
                arrayImages.push(urlImagen);

                const processedImage = sharp(buffer64).resize(300, 300, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }).png();
                const buffer = await processedImage.toBuffer(); // .options.input.buffer

                fs.writeFileSync(process.cwd() + '/optimized/' + strFileName, buffer);
            });
            // ------------------------------------------- upload Images --------------------------------------------------



            // insertar la imagenes a la base de datos ------------------------
            const imagesPromisesCreate = arrayImages.map(async(img) => {
                let image = await Images.create({
                    url_image: img
                });
                return image;
            });
            await Promise.all(imagesPromisesCreate);


            // realizar la asociación con productos y imagenes -----------------
            const imagesPromises = arrayImages.map(async(img) => {
                let image = await Images.findAll({
                    where: { url_image: img }
                });

                return newProduct.setImages(image); //la asociacion la realiza como objeto
            });
            await Promise.all(imagesPromises);


            return { msg: 'The products was created successfully' };

        } catch (error) {
            return returnErrorMessage(error)
        }
    }




    async update(id, product) {

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

            if (!brandFounded) {
                throw 'The brand does not exist';
            }

            const updateProduct = {
                name,
                description,
                technical_especification,
                price,
                stock,
                brandId: brandFounded.dataValues.id
            }

            let response = await Products.update(updateProduct, {
                where: {
                    id: id
                }
            });

            if (response[0] === 0) {
                throw "Product not found";
            }

            let productUpdated = await Products.findByPk(id)

            const categoriesPromises = categories.map(async(cat) => {
                let category = await Categories.findAll({
                    where: { name: cat.name }
                });

                return productUpdated.setCategories(category); //la asociacion la realiza como objeto
            });

            const imagesPromises = images.map(async(img) => {
                let image = await Images.findAll({
                    where: { url_image: img }
                });

                return productUpdated.setImages(image); //la asociacion la realiza como objeto
            });

            await Promise.all(categoriesPromises, imagesPromises);


            return { msg: 'The products was updated successfully' };


        } catch (error) {
            return returnErrorMessage(error);
        };
    }

    async delete(id) {
        try {
            let response = await Products.destroy({
                where: {
                    id: id
                }
            });

            if (response === 0) {
                throw "Product not found";
            }
            if (response === 1) {
                return { msg: "Delete Product sucessufully" }
            }
        } catch (error) {
            return returnErrorMessage(error);
        };
    };
}


module.exports = serviceProducts;