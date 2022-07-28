'use strict';
const { Op } = require('sequelize');
const { Products, Categories, Brands, Images, Reviews } = require("../db.js");

// ---------------------------------- implementation upload ----------------------------------
const sharp = require('sharp');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { dirname } = require('path');

// Require the cloudinary library
const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
// cloudinary.config({
//   secure: true
// });


cloudinary.config({ 
    cloud_name: 'dsvu8zpd1', 
    api_key: '391599671867836', 
    api_secret: 'qOJpTCyYY-HNVoLLy34ami5Ig4k' 
  });


// Log the configuration
//console.log(cloudinary.config());

// ---------------------------------- implementation upload ----------------------------------

const returnErrorMessage = require("../utils/msgErrors.js");





/////////////////////////
// Uploads an image file
/////////////////////////
const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions
    const options = {
      use_filename: true,
      unique_filename: false,
      overwrite: true,
      securte: true,
    };

    try {
      // Upload the image
      const result = await cloudinary.uploader.upload(imagePath, options);
      return result.secure_url; //public_id;
    } catch (error) {
      console.error(error);
    }
};


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
                include: [Categories, Brands, Images] //Falta incluir Reviews
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
        const { name, description, technical_especification, price, stock, categories, images, brand, state } = product;
        try {
            if (!name || !description || !technical_especification || !price || !stock || !categories || !state) {
                throw 'Name, Description, Thecnical Description, Price, Stock, State and Categories are requerid fields.';
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
                state
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
            const protocol = req.protocol;
            const serverName = protocol + "://" + req.get("host") + "/api/";

            //let arrayImages = []; // guarada los nombres de las imagenes para las url
            
            //arrBuffer.forEach(async(buffer64, index) => {
            const arrayCloudinaryPromises = 
                arrBuffer.map(async(buffer64, index) => {                
                const uuid = uuidv4();
                const strFileName = uuid + ".png"; // nombre de la imgagen optimizada

                const urlImagen = serverName + "products/images/" + strFileName;
                //arrayImages.push(urlImagen);

                const processedImage = sharp(buffer64).resize(300, 300, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                }).png();
                const buffer = await processedImage.toBuffer(); // .options.input.buffer


                fs.writeFileSync(process.cwd() + '/optimized/' + strFileName, buffer);

                const imageCloudynary = process.cwd() + '/optimized/' + strFileName;
                const imagedLoaded = await uploadImage(imageCloudynary);
                console.log("*====== secureUrl:",imagedLoaded);
                //arrayImages = [...arrayImages , imagedLoaded];
                return imagedLoaded;
            });
            // ------------------------------------------- upload Images --------------------------------------------------

            const arrayImages = await Promise.all(arrayCloudinaryPromises);          
            // --- pasarla a cloudinary y guardarla en la base de datos
                        
            // insertar la imagenes a la base de datos ------------------------
            const imagesPromisesCreate = arrayImages.map(async(img) => {

                console.log("IMAGEN PARA GUARDAR:",img);
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




    async update(id, product, req) {

        const { name, description, technical_especification, price, stock, categories, images, brand, state } = product;
        try {
            if (!name || !description || !technical_especification || !price || !stock || !categories || !state) {
                throw 'Name, Description, Thecnical Description, Price, Stock, State and Categories are requerid fields.';
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


            // borrar las imagenes primero antes de actualizar el producto
            // ============================================================ eliminar imagenes del directorio optimized
            let imageProduct = await Products.findByPk(id);
            if (!imageProduct) {
                throw "Product not found";
            }

            // let arrayImagesDelete = await imageProduct.getImages();
            // if (arrayImagesDelete.length > 0) {
            //     arrayImagesDelete.forEach(async(image) => {
            //         try {
            //             const strImageDelete = image.dataValues.url_image.split('/').pop(); 
            //             fs.unlinkSync(process.cwd() + '/optimized/' + strImageDelete);
            //         }   catch (error) {
                        
            //         }                    
            //     }
            //     );
            // }
            // ============================================================ eliminar imagenes del directorio optimized




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
                state
            }



            let response = await Products.update(regProduct, {
                where: {
                    id: id
                }
            });

            if (response[0] === 0) {
                throw "Product not found";
            }

            let updateProduct = await Products.findByPk(id)


            const categoriesPromises = arrayCategories.map(async(cat) => {
                let category = await Categories.findAll({
                    where: { name: cat.name }
                });
                return updateProduct.setCategories(category); //la asociacion la realiza como objeto
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
            const protocol = req.protocol;
            const serverName = protocol + "://" + req.get("host") + "/api/";



            // *****************
            // let arrayImages = []; // guarada los nombres de las imagenes para las url
            // arrBuffer.forEach(async(buffer64, index) => {
            //     const uuid = uuidv4();
            //     const strFileName = uuid + ".png"; // nombre de la imgagen optimizada

            //     const urlImagen = serverName + "products/images/" + strFileName;
            //     arrayImages.push(urlImagen);

            //     const processedImage = sharp(buffer64).resize(300, 300, {
            //         fit: 'contain',
            //         background: { r: 0, g: 0, b: 0, alpha: 0 }
            //     }).png();
            //     const buffer = await processedImage.toBuffer(); // .options.input.buffer

            //     fs.writeFileSync(process.cwd() + '/optimized/' + strFileName, buffer);
            // });



            const arrayCloudinaryPromises = 
            arrBuffer.map(async(buffer64, index) => {                
            const uuid = uuidv4();
            const strFileName = uuid + ".png"; // nombre de la imgagen optimizada

            const urlImagen = serverName + "products/images/" + strFileName;
            //arrayImages.push(urlImagen);

            const processedImage = sharp(buffer64).resize(300, 300, {
                fit: 'contain',
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }).png();
            const buffer = await processedImage.toBuffer(); // .options.input.buffer


            fs.writeFileSync(process.cwd() + '/optimized/' + strFileName, buffer);

            const imageCloudynary = process.cwd() + '/optimized/' + strFileName;
            const imagedLoaded = await uploadImage(imageCloudynary);
            console.log("*====== secureUrl:",imagedLoaded);
            //arrayImages = [...arrayImages , imagedLoaded];
            return imagedLoaded;
        });
        // ------------------------------------------- upload Images --------------------------------------------------

        const arrayImages = await Promise.all(arrayCloudinaryPromises);          




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

                return updateProduct.setImages(image); //la asociacion la realiza como objeto
            });
            await Promise.all(imagesPromises);


            return { msg: 'The products was update successfully' };

        } catch (error) {
            return returnErrorMessage(error)
        }

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