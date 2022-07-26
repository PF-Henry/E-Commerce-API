'use strict';

const { Op } = require('sequelize');
const { Users, Roles, Permissions } = require('../db.js');
const { hashPassword, comparePassword } = require('../utils/hashing.js');
const returnErrorMessage = require('../utils/msgErrors.js');

class serviceUsers {
    constructor() {
        this.users = [];
    }

    async getAll(name) {
        try {
            if (name) {
                return await Users.findAll(
                    {where: {
                            
                        [Op.or]: [{first_name:{[Op.iLike]: `%${name}%`}},{last_name:{[Op.iLike]: `%${name}%`}}]     
                        },
                order: [['last_name', "asc"], ['first_name',"asc"]],
                // attributes: ['id', 'name']
                    attributes: {exclude: ['password']},
                    include: [{
                        model: Roles,
                        attributes: ['id', 'name'],
                        include: Permissions
                    }]
                }
                   )
            } else {
                const users = await Users.findAll({
                    attributes: {exclude: ['password']},
                    include: [{
                        model: Roles,
                        attributes: ['id', 'name'],
                        include: Permissions
                    }]
                });
                return users;
                    }  
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            const user = await Users.findByPk(id, {
                include: [{
                    model: Roles,
                    attributes: ['id', 'name'],
                    include: Permissions
                }]
            });
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
                },
                // attributes: ['id', 'first_name', 'last_name', 'email'],
                include: [{
                    model: Roles,
                    attributes: ['id', 'name'],
                    include: Permissions
                }]
            });
            return user;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async create(body) {
        const role = 'User';
        const { password } = body;
        try {
            const hashedPassword = await hashPassword(password);

            // roles
            const roleFound = await Roles.findOne({
                where: { name: role }
            });

            if (!roleFound) {
                throw 'Role not found';
            }

            const user = await Users.create({
                ...body,
                password: hashedPassword,
                roleId: roleFound.id
            });
            //await user.addRoles(roleFound);

            // return { ...user.dataValues, password: null };
            return { msg: 'User created successfully' };
        } catch (error) {
            console.log(error)
            return returnErrorMessage(error);
        }
    }

    async update(id, user) {
        try {
            const user = await Users.update(user, {
                where: {
                    id: id
                }
            });
            if (user === 0) {
                throw 'User not found';
            }
            if (user === 1) {
                return { msg: 'User updated successfully' };
            }

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async delete(id) {
        try {
            const response = await Users.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw 'User not found';
            }
            if (response === 1) {
                return { msg: 'User deleted successfully' };
            }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceUsers;