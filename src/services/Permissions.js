'use strict';

const { Permissions } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class servicePermissions {
    constructor() {
        this.permissions = [];
    }

    async getAll() {
        try {
            return await Permissions.findAll({
                order: ['entity'],
                attributes: ['id', 'entity', 'get', 'post', 'put', 'delete']
            });
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let permission = await Permissions.findByPk(id);
            if (!permission) {
                throw "Permission not found";
            }
            return permission
        } catch (error) {
            return returnErrorMessage(error);
        }

    }


    async create(permission) {
        const { entity, get, post, put} = permission;
        const {adelete} = permission.delete;
        try {
            if (!entity || !get || !post || !put || !adelete) {
                throw 'entity or get or post or put or delete are requerid field.';
            }

            const regPermission = { entity, get, post, put, adelete };

            await Permissions.create(regPermission);

            return { msg: 'The permission were created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, permission) {
        const { entity, get, post, put} = permission;
        const {adelete} = permission.delete;
        const {id} = id;
        try {
            if (!id && !entity && !get && !post && !put && !adelete) {
                throw 'Id and entity and get and put and post and delete are required';
            }
            let permission = await Permissions.findByPk(id);
            if (!permission) {
                throw "Permission not found";
            }
            if (entity) permission.entity = entity;
            if (get) permission.get = get;
            if (post) permission.post = post;
            if (put) permission.put = put;
            if (adelete) permission.adelete = adelete;
            await permission.save();

            return { msg: "Update Permission sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async delete(id) {
        try {
            let response = await Permissions.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw "Permission not found";
            }
            return { msg: "Delete Permission sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceBrands;