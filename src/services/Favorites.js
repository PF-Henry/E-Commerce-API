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
            await user.addRole(roleFound);

            // return { ...user.dataValues, password: null };
            return { msg: 'User created successfully' };
        } catch (error) {
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