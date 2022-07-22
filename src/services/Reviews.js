'use strict';

const { Reviews, Products } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceReviews {
    constructor() {
        this.reviews = [];
    }

    async getAll() {
        try {
            return await Reviews.findAll({
                order: ['id'],
                include: [{ model: Products }]
            });
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let review = await Reviews.findByPk(id);
            if (!review) {
                throw "Review not found";
            }
            return review
        } catch (error) {
            return returnErrorMessage(error);
        }

    }

    async create(review) {
        const { rating, content, idProduct, idOrder } = review;
        try {
            if (!rating || !content || !idProduct || !idOrder) {
                throw 'Rating or Content or idProduct or idOrder is requerid field.';
            }
            const productId 
            const regReview = { rating, content, idProduct, idOrder };

            await Reviews.create(regReview);

            return { msg: 'The Review was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id) {
        try {
            if (!id) {
                throw 'Id is required';
            }
            let review = await Reviews.findByPk(id);
            if (!review) {
                throw "Review not found";
            }
            review.verified = true;
            await review.save();

            return { msg: "Update Review sucessfully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async delete(id) {
        try {
            let response = await Reviews.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw "Review not found";
            }
            return { msg: "Delete Review sucessfully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceReviews;