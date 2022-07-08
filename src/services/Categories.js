'use strict';

const { Categories } = require("../db.js");

class serviceCategories {
    constructor() {
        this.categories = [];
    }

    async getAll() {
        try {
            return await Categories.findAll({
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        return await Categories.findByPk(id);
    }


    async create(category) {
        const { name } = category;
        try {
            if (!name) {
                throw 'Name is requerid field.';
            }

            const regCategory = { name };

            // const newCategory = await Categories.create(regCategory);

            return { msg: 'The category was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, category) {
        
        return await Categories.update(category, {
            where: {
                id: id
            }
        });
    }

    async delete(id) {
        return await Categories.destroy({
            where: {
                id: id
            }
        });
    }
}

module.exports = serviceCategories;