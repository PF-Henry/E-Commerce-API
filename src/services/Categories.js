'use strict';

const { Categories } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

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
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let category = await Categories.findByPk(id);
            if (!category) {
                throw "Category not found";
            }
            return category
        } catch (error) {
            return returnErrorMessage(error);
        }
    }


    async create(category) {
        const { name } = category;
        try {
            if (!name) {
                throw 'Category name is requerid.';
            }

            if (name.lenth > 20) {
                throw 'Category name is requerid.';
            }

            const regCategory = { name };

            await Categories.create(regCategory);

            return { msg: 'The category was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, category) {
        try {

            const name = category.name;

            if (!name) {
                throw 'Category name is requerid.';
            }

            if (name.lenth > 20) {
                throw 'Category name is requerid.';
            }


            let response = await Categories.update(category, {
                where: {
                    id: id
                }
            });
            if (response[0] === 0) {
                throw "Category not found";
            }
            if (response[0] === 1) {
                return { msg: "Update Category sucessufully" }
            }
        } catch (error) {
            return returnErrorMessage(error);
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
                throw "Category not found";
            }
            if (response === 1) {
                return { msg: "Delete Category sucessufully" }
            }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceCategories;