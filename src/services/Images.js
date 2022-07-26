'use strict';

const { Images } = require("../db.js");

class serviceImages {
    constructor() {
        this.images = [];
    }

    async getAll() {
        try {
            return await Images.findAll({});
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        return await Images.findByPk(id);
    }


    async create(image) {
        const { url_image } = image;
        try {
            if (!url_image) {
                throw 'URL image is requerid field.';
            }

            const regImage = { url_image };

            const newImage = await Images.create(regImage);

            return { msg: 'The image was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, image) {
        try {
            return await Images.update(image, {
                where: {
                    id: id
                }
            });
        } catch (error) {
            return error;
        }
    }


    async delete(id) {
        try {
            return await Images.destroy({
                where: {
                    id: id
                }
            });
        } catch (error) {
            return error;
        }
    }
}

module.exports = serviceImages;