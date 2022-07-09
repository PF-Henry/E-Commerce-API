'use strict';

const { Categories } = require("../db.js");

class serviceCategories {
    constructor() {
        this.categories = [];
    }

    async getAll() {
        try {
            return await Categories.findAll({
                order: ['name'],
                attributes: ['id', 'name']
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try {
            let category = await Categories.findByPk(id);
            if (!category) {
                throw { error: "Category not found" }
            }
            return category
        } catch (error) {
            return error;
        }
    }


    async create(category) {
        const { name } = category;
        try {
            if (!name) {
                throw 'Name is requerid field.';
            }

            const regCategory = { name };

            await Categories.create(regCategory);

            return { msg: 'The category was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, category) {
        try {
            let response = await Categories.update(category, {
                where: {
                    id: id
                }
            });
            if (response[0] === 0) {
                throw { error: "Category not found" };
            }
            if (response[0] === 1) {
                return { msg: "Update Category sucessufully" }
            }
        } catch (error) {
            return error;
        }

    }

    async delete(id) {
        try {
            let response = await Categories.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw { error: "Category not found" };
            }
            if (response === 1) {
                return { msg: "Delete Category sucessufully" }
            }
        } catch (error) {
            return error;
        }
    }
}

module.exports = serviceCategories;