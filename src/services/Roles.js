'use strict';

const { Roles, Permissions } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceRoles {
    constructor() {
        this.roles = [];
    }

    async getAll() {
        try {
            return await Roles.findAll({
                order: ['name'],
                attributes: ['id', 'name'],
                include: [{ model: Permissions }]
            });
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let brand = await Roles.findByPk(id);
            if (!brand) {
                throw "Role not found";
            }
            return brand
        } catch (error) {
            return returnErrorMessage(error);
        }

    }

    async create(role) {
        const { name } = role;
        try {
            if (!name) {
                throw 'Name is requerid field.';
            }

            const regRole = { name };

            await Roles.create(regRole);

            return { msg: 'The role was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, name) {
        try {
            if (!name) {
                throw 'Name is required';
            }
            let role = await Roles.findByPk(id);
            if (!role) {
                throw "Role not found";
            }
            if (name) role.name = name;
            await role.save();

            return { msg: "Update Role sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }


    async delete(id) {
        try {
            let response = await Roles.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw "Role not found";
            }
            return { msg: "Delete Role sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceRoles;