'use strict';

const { OrdersItems, Products, Orders, Images } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceReviews {
    constructor() {
        this.reviews = [];
    }


    
    async findByUser(userId) {
        try {
            const reviews = await OrdersItems.findAll(
                {
                include: [{
                    model: Orders,
                    where: [{userId: userId}, {state: 'completed'}],
                    order: [['id', 'DESC']]
                },
                {model: Products, include: [{model: Images}]}
                ],
                attributes: ['id', 'rating', 'content', 'orderId', 'productId'],
            }
            );
            return reviews;
        } catch (error) {
            console.log(error);
            return returnErrorMessage(error);
        }
    };

  
    // async findByProduct(userId) {
    //     try {
    //         const reviews = await OrdersItems.findAll(
    //             {
    //             include: [{
    //                 model: Orders,
    //                 where: [{userId: userId}, {state: 'completed'}],
    //                 order: [['id', 'DESC']]
    //             },
    //             {model: Products, include: [{model: Images}]}
    //             ],
    //             attributes: ['id', 'rating', 'content', 'orderId', 'productId'],
    //         }
    //         );
    //         return reviews;
    //     } catch (error) {
    //         console.log(error);
    //         return returnErrorMessage(error);
    //     }
    // };
    

    

    //  en el body enviar :
    // {
    //    orderItemId: 10,
    //    content: "Buen producto",
    //    rating: 5,
    // }   
    //
    async updateReview(review) {
        const { rating, content, orderItemId } = review;
        try {
            if (!rating || !content || !orderItemId) {
                throw 'Rating or Content or orderItemId is requerid field.';
            }
            const regReview = { rating, content, orderItemId };

            let review = await OrderItems.findByPk(orderItemId);
            if (!review) {
                throw "Review not found";
            }
            return { msg: 'The review was created successfully' };

        } catch (error) {
            return returnErrorMessage(error)
        }
    };




}

module.exports = serviceReviews;