'use strict';

const { Brands } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceBrands {
    constructor() {
        this.brands = [];
    }

    async getAll(name) {
        try {
            if (name) {
                return await Brands.findAll({
                    where: {
                            name: {[Op.iLike]: `%${name}%`}
                            },
                    order: ['name'],
                    attributes: ['id', 'name', 'image']
                        })
            } else {
                return await Brands.findAll({
                    order: ['name'],
                    attributes: ['id', 'name', 'image']
                })
                    }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw "Brand not found";
            }
            return brand
        } catch (error) {
            return returnErrorMessage(error);
        }

    }


    async create(brand) {
        const { name, image } = brand;
        try {
            if (!name || !image) {
                throw 'Name or Image is requerid field.';
            }

            const regBrand = { name, image };

            await Brands.create(regBrand);

            return { msg: 'The brand was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, name, image) {
        try {
            if (!name && !image) {
                throw 'Name and image are required';
            }
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw "Brand not found";
            }
            if (name) brand.name = name;
            if (image) brand.image = image;
            await brand.save();

            return { msg: "Update Brand sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async delete(id) {
        try {
            let response = await Brands.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw "Brand not found";
            }
            return { msg: "Delete Brand sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceBrands;