'use strict';

const { Brands } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceBrands {
    constructor() {
        this.brands = [];
    }

    async getAll() {
        try {
            return await Permissions.findAll({
                order: ['entity'],
                // attributes: ['id', 'name', 'image']
            });
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    // async getById(id) {
    //     try {
    //         let brand = await Brands.findByPk(id);
    //         if (!brand) {
    //             throw "Brand not found";
    //         }
    //         return brand
    //     } catch (error) {
    //         return returnErrorMessage(error);
    //     }

    // }


    async create(permissions) {
        const { entity, get, post, put, delete} = permissions;
        try {
            if (!entity || !get || !post || !put || !delete) {
                throw 'entity or get or post or put or delete are requerid field.';
            }

            const regPermissions = { entity, get, post, put, delete };

            await Permissions.create(regBrand);

            return { msg: 'The permissions were created successfully' };

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