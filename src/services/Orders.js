'use strict';

const { Orders, OrdersItems, Products, Users } = require("../db.js");
const returnErrorMessage = require("../utils/msgErrors.js");

class serviceOrders {
    constructor() {
        this.orders = [];
    }

    async getAll() {
        try {
            return await Orders.findAll(
                {
                    include: [{ model: Users }, { model: OrdersItems }]
                }
            ); 
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


    async getOrdersByUser(userId){
        try {
            const orders = await Orders.findAll(
                {
                    where: {
                        userId: userId
                    },
                    include: [{ model: OrdersItems }]
                }
            ); 
            return orders;
        } catch (error) {
            return returnErrorMessage(error);
        }
    }


    async create(order) {
        const { userId, sell_date, sell_time, total_sell, state, 
            mp_order_id, mp_status, mp_order_status, orders_items } = order;
        try {
            if (!sell_date || !sell_time || !total_sell || !state || !orders_items) {
                throw 'data not received.';
            }

            // VERIFICCACION DE EXISTENCIA DE USUARIO --------------------
            // buscar el usuario con userId, y luego hacer un agregado a las ordernes del usuario.
            const user = await Users.findByPk(userId);
            if(!user){
                 throw "User not found";
            }

            const regOrder = {  sell_date, sell_time, total_sell, state, 
                                mp_order_id, mp_status, mp_order_status };

            const newOrder =  await Orders.create(regOrder);
            
            if(!newOrder){
                throw "Order not created";
            }

            
            user.addOrders(newOrder);

            //crear orderItems ------------------------------------------

            const itemsPromisesCreate = orders_items.map(async(item) => {
                let itemCreate = await OrdersItems.create(item); // crear el item
                newOrder.addOrdersItems(itemCreate);
            });
            await Promise.all(itemsPromisesCreate);


            // crear descontar de stock ------------------------------------------
            // 
            const stockPromisesCreate = orders_items.map(async(item) => {
                let updateProduct = await Products.findByPk(item.productId); // crear el item
                updateProduct.stock = updateProduct.stock - item.quantity;
                await updateProduct.save();
            });
            
            await Promise.all(stockPromisesCreate);

            return { msg: 'The Order was created successfully' };

        } catch (error) {
            return returnErrorMessage(error);
        }
    }


    // state puede ser: ENUM('created', 'processing', 'canceled', 'completed')
    async updateState(id, state) {
        try {
            const order = await Orders.findByPk(id);
            if (!order) {
                throw "Order not found";
            }
            order.state = state.toLowerCase();
            await order.save();


            const stock = "";
            if (state.toLowerCase() === 'canceled') {
                // restar stock de productos
                const items = await OrdersItems.findAll({where: {orderId: id}});
                const itemsPromises = items.map(async(item) => {
                    let updateProduct = await Products.findByPk(item.productId); // crear el item
                    updateProduct.stock = updateProduct.stock + parseInt(item.quantity);
                    stock = stock + " ----->product:" + item.productId + " -STOCK:" + updateProduct.stock + item.quantity;
                    await updateProduct.save();
                });
                await Promise.all(itemsPromises);
            }
            

            if (state === 'complete') {
                // enviar correo de envio de orden de compra

            };
            return { msg: stock };

            //return { msg: 'The State Order was updated successfully' };
        } catch (error) {
            return returnErrorMessage(error);
        }
    };


   // state puede ser: ENUM('created', 'processing', 'cancelled', 'complete')
   async updateMpState(mp_order_id, mp_order_status) {
    try {
        const orders = await Orders.findAll({where: {mp_order_id: mp_order_id}});
        if (!orders) {
            throw "Order not found";
        }

        const order = orders[0];        
        order.mp_order_status = mp_order_status;
        await order.save();
        return { msg: 'The MP Status Order was updated successfully' };
    } catch (error) {
        return returnErrorMessage(error);
    }
};


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
            let response = await Orders.destroy({
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