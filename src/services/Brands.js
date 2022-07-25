'use strict';

const { Brands } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceBrands {
    constructor() {
        this.brands = [];
    }

    async getAll() {
        try {
            return await Brands.findAll({
                order: ['name'],
                attributes: ['id', 'name', 'image']
            });
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
        const { name } = brand;
        try {
            if (!name) {
                throw 'Brand name is requerid field.';
            }

            if (name.lenth > 20) {
                throw 'Brand name is requerid.';
            }

            const regBrand = { name };

            await Brands.create(regBrand);

            return { msg: 'The brand was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, name) {
        try {
            if (!name) {
                throw 'Name and image are required';
            }

            if (name.lenth > 20) {
                throw 'Brand name is requerid.';
            }
            
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw "Brand not found";
            }
            if (name) brand.name = name;
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