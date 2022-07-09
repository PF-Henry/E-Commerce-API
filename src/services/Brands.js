'use strict';

const { Brands } = require("../db.js");

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
            return error;
        }
    }

    async getById(id) {
        try {
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw { error: "Brand not found" }
            }
            return brand
        } catch (error) {
            return error;
        }

    }


    async create(brand) {
        const { name, image } = brand;
        try {
            if (!name || !image) {
                throw { error: 'Name or Image is requerid field.' };
            }

            const regBrand = { name, image };

            await Brands.create(regBrand);

            return { msg: 'The brand was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, name, image) {
        try {
            if (!name && !image) {
                throw { error: 'Name and image are required' };
            }
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw { error: "Brand not found" };
            }
            if (name) brand.name = name;
            if (image) brand.image = image;
            await brand.save();

            return { msg: "Update Brand sucessufully" }
        } catch (error) {
            return error
        }
    }

    async delete(id) {

        let response = await Brands.destroy({
            where: {
                id: id
            }
        });
        if (response === 0) {
            throw { error: "Brand not found" };
        }
        return { msg: "Delete Brand sucessufully" }
    }
}

module.exports = serviceBrands;