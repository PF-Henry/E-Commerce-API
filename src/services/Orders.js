'use strict';

const { Orders, OrdersItems, Products } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceOrders {
    constructor() {
        this.orders = [];
    }

    async getAll() {
        try {
            return await Orders.findAll();
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async getById(id) {
        try {
            let order = await Orders.findByPk(id);
            if (!order) {
                throw "Brand not found";
            }
            return order
        } catch (error) {
            return returnErrorMessage(error);
        }

    }


    async create(order) {
        const { sell_date, sell_time, total_sell, state, orders_items } = order;
        try {
            if (!sell_date || !sell_time || !total_sell || !state || !orders_items) {
                throw 'data not received.';
            }

            const regOrder = { sell_date, sell_time, total_sell, state };

            const newOrder =  await Orders.create(regOrder);
            
            if(!newOrder){
                throw "Order not created";
            }

            //crear orderItems



            return { msg: 'The Order was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async update(id, name, image) {
        try {
            if (!name && !image) {
                throw 'Name and image are required';
            }
            let brand = await Brands.findByPk(id);
            if (!brand) {
                throw "Brand not found";
            }
            if (name) brand.name = name;
            if (image) brand.image = image;
            await brand.save();

            return { msg: "Update Brand sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }

    async delete(id) {
        try {
            let response = await Brands.destroy({
                where: {
                    id: id
                }
            });
            if (response === 0) {
                throw "Brand not found";
            }
            return { msg: "Delete Brand sucessufully" }
        } catch (error) {
            return returnErrorMessage(error);
        }
    }
}

module.exports = serviceOrders;