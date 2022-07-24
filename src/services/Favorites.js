'use strict';

const { Images, Users, Products } = require('../db.js');
const returnErrorMessage = require('../utils/msgErrors.js');

class serviceUsers {
    constructor() {
        this.users = [];
    }


    

    async addFavourite(body) {
        try {
            const { userId, productId } = body;
            const user = await Users.findByPk(userId);
            if (!user) {
                throw 'User not found';
            }

            const product = await Products.findByPk(productId);
            if (!product) {
                throw 'Product not found';
            }
            const favourite = await user.addProducts(product);

            return { msg: 'Favorite added successfully' };
        } catch (error) {
            console.log("ERROR: ", error);
            return returnErrorMessage(error);
        }
    }



    async removeFavourite(body) {
        try {
            const { userId, productId } = body;
            const user = await Users.findByPk(userId);
            if (!user) {
                throw 'User not found';
            }  
            const product = await Products.findByPk(productId);
            if (!product) {
                throw 'Product not found';
            }
            const favourite = await user.removeProducts(product);
            return { msg: 'Favorite removed successfully' };
        } catch (error) {
            return returnErrorMessage(error);
        }
    };



    async getFavoritesByUser(id) {
        try {
            const user = await Users.findByPk(id);
            if (!user) {
                throw 'User not found';
            }

            const favorites = await user.getProducts({attributes: ['id', 'name', 'price', 'stock', 'description'], 
                include: [{model: Images, attributes:['id', 'url_image']},  ]});
            return favorites;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }


    async getFavoritesByProudct(id) {
        try {
            const product = await Products.findByPk(id);
            if (!product) {
                throw 'Product not found';
            }
            
            const favorites = await product.getUsers({ attributes: ['id', 'first_name', 'last_name']});
            return favorites;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

}

module.exports = serviceUsers;