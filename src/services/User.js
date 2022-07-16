'use strict';

const { Op } = require('sequelize');
const { Users, Roles, Permissions } = require('../db.js');
const { hashPassword, comparePassword } = require('../utils/hashing.js');
const returnErrorMessage = require('../utils/msgErrors.js');

class serviceUsers {
    constructor() {
        this.users = [];
    }

    async getAll() {
        try {
            const users = await Users.findAll({
                attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [{
                    model: Roles,
                    attributes: ['id', 'name'],
                    include: Permissions
                }]
            });
            return users;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            const user = await Users.findByPk(id);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getByEmail(email) {
        try {
            const user = await Users.findOne({
                where: {
                    email: email
                }
            });
            return user;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async create(body) {
        const { password, role="User" } = body;
        try {
            const hashedPassword = await hashPassword(password);

            // roles
            const roleFound = await Roles.findOne({
                where: { name: role }
            });

            const user = await Users.create({
                ...body,
                password: hashedPassword,
                roleId: roleFound.id
            });

            // return { ...user.dataValues, password: null };
            return { msg: 'User created successfully' };
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, body) {
        try {
            const user = await Users.findByPk(id);
            await user.update(body);
            return user;
        } catch (error) {
            throw error;
        }
    }

    async delete(id) {
        try {
            const user = await Users.destroy({
                where: {
                    id
                }
            });
            return user;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = serviceUsers;