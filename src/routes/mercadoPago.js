const { Router } = require('express');
const router = Router();
const axios = require('axios');
const mercadopago = require("mercadopago");

const sendEmail = require("../utils/email/index.js");


const ServiceOrders = require('../services/Orders.js');
const serviceOrders = new ServiceOrders();

const ServiceUsers = require('../services/User.js');
const serviceUsers = new ServiceUsers();

//const MERCADOPAGO_ACCESS_TOKEN = process.env.MERCADOPAGO_ACCESS_TOKEN;
const MERCADOPAGO_ACCESS_TOKEN =  "TEST-3352840888653824-082717-2089459f87c4aa1e9d28f7ea67610f6b-13551993"; // qutiles.

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    //access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
	access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || MERCADOPAGO_ACCESS_TOKEN,
});
  


router.post("/create_preference", async (req, res) => {
	
    // obtener el nombre del servidor 
    const protocol = req.protocol;
    const SERVER_NAME = protocol + "://" + req.get("host") + "/api/mercadoPago";
    const HTTP_ORIGIN = req.headers.origin;
 
    // SE INICIA SERVIDOR CON ngrok y se obtiene el nombre del servidor para pruebas locales
    // const LOCAL_TEST_SERVER = "https://9d1f-179-48-255-180.sa.ngrok.io";    // PARA PRUEBA LOCAL    ***
    // const SERVER_HTTPS = LOCAL_TEST_SERVER + "/api/mercadoPago";            // PARA PRUEBA LOCAL    ***
    const SERVER_HTTPS = SERVER_NAME;  // <-------- para pruebas remoto

    // console.log("SERVER_NAME: " + SERVER_NAME);
    // console.log("HTTP_ORIGIN: " + HTTP_ORIGIN);
    // console.log(" ----------------------------------- ");

    // DESTRUCTURACION DEL CARRITO -------------------------
    const  userId  = req.body.userId;
    const  orderItems = req.body.orderItems;

    if (userId == null || orderItems == null) {
        res.status(400).send({
            message: "Bad Request"
        });
    }
    //console.log("items: del carrito ############ ",orderItems);
    const preferenceOrderItem = orderItems.map(item => {
        return {
            id: item.id.toString(),
            title: item.name,
	        unit_price: parseInt(item.price),
		    quantity: parseInt(item.quantity),
        }
    });
    
    // ARMADO DEL ARCHIVO DE PREFERENCIA  
	let preference = {
        external_reference: userId.toString(),  // idclietne
        items: preferenceOrderItem,
		back_urls: {
			"success": `${HTTP_ORIGIN}/auth/feedback`,
			"failure": `${HTTP_ORIGIN}/auth/feedback`,
			"pending": `${HTTP_ORIGIN}/auth/feedback`,
		},
        auto_return: "approved",
        notification_url: `${SERVER_HTTPS}/notification`,	
	};

	mercadopago.preferences.create(preference)
		.then(async function (response) {
            // console.log("PREFERENCE <-- MercadoPago: client_id:", response.body.client_id);
            // console.log("PREFERENCE <-- MercadoPago: collector_id:", response.body.collector_id);
            // console.log("PREFERENCE <-- MercadoPago: id:", response.body.id);
            // console.log("PREFERENCE <-- MercadoPago: userId:", response.body.external_reference);
            // console.log("PREFERENCE <-- MercadoPago: items:", response.body.items);
            //console.log("________________ RETURN PREFERENCE ___________________");

			res.json({
				id: response.body.id,                   // se devuelve el id de la preferencia al frontend
                init_point: response.body.init_point    // se puede devolver el link de la preferencia
			});
		}).catch(function (error) {
			console.log(error);
		});
});



router.post("/notification", (req, res) => {
    
    console.log("NOTIFICACION");
    //console.log("---------------------------------------");
    const { topic, id } = req.query;

    if (topic === "merchant_order") {
        //console.log(" ============= MERCHANT ORDER Nº:" + id + " ========================= ");

        axios.get(`https://api.mercadopago.com/merchant_orders/${id}`, 
                {headers: {"Authorization": "Bearer " + MERCADOPAGO_ACCESS_TOKEN }})
            .then(async function (response) {
                
                const merchantOrder = response.data;
                const userId = merchantOrder.external_reference;
                const merchantOrderID = merchantOrder.id;
                const merchantStatus = merchantOrder.status;    // valores posibles: "pending", "approved", "rejected", "cancelled", "in_process", "reclaimed"
                const merchantOrderStatus = merchantOrder.order_status;  // valores posibles payment_require
                const merchantItems = merchantOrder.items;
                const merchantTotalAmount = merchantOrder.total_amount;
                const merchantDateTime = merchantOrder.date_created;
                const merchantDate = merchantDateTime.substring(0, 10);
                const merchantTime = merchantDateTime.substring(11, 19);

                // console.log("MO : Nº ", merchantOrderID);
                // console.log("MO : status ", merchantStatus);
                // console.log("MO : oreder_status ", merchantOrderStatus);
                // console.log("MO : total_amount ", merchantTotalAmount);
                // console.log("MO : DATE ", merchantDate); // date
                // console.log("MO : TIME ", merchantTime); // time
                // console.log("_______ ITEMS : ______________________");
                // console.log(merchantItems);
                

                // se guarda el estado de la orden en la base de datos
                // crear (order y orden item) para el usuario comprador **************

                const parseMerchantItems = merchantItems.map(item => {
                    return {
                        productId: parseInt(item.id),
                        unit_price: parseFloat(item.unit_price),
                        quantity: parseInt(item.quantity),
                    }
                });


                const order = {
                    userId: userId,
                    sell_date: merchantDate,
                    sell_time: merchantTime,
                    total_sell: merchantTotalAmount,
                    state: "created",
                    mp_order_id: merchantOrderID,
                    mp_status: merchantStatus,
                    mp_order_status: merchantOrderStatus,
                    orders_items: parseMerchantItems, 
                };

                const newOrder = await serviceOrders.create(order);
                //console.log("=========> responseOrders: ", newOrder);

                // enviar correo de compra a usuario *****************************  

                if (newOrder.id != null) {
                    const user = await serviceUsers.getById(userId);

                    const orderItems = await parseMerchantItems.map(async(item) => {
                        let product = await servicesProducts.getById(item.productId);
                        return {    productId: product.productId, 
                                    name: product.name,
                                    unit_price: parseFloat(item.unit_price),
                                    quantity: parseInt(item.quantity),
                                    subtotal: parseFloat(item.unit_price) * parseInt(item.quantity), };
                    });

                    const orderItemsFinal = await Promise.all(orderItems);

                    const mailOptions = {
                        first_name: user.first_name,
                        last_name: user.last_name,
                        orderId: order.id,
                        total_sell: merchantTotalAmount,
                        orderItems: orderItemsFinal
                    };
    
                    sendEmail(user.email, user, mailOptions, "newOrder");                 
                }
                

                // const user = await serviceUsers.getById(userId);
                // const userEmail = user.email;
                // const userFirstName = user.first_name;
                // const userLastName = user.last_name;
                
            })
            .catch(function (error) {
            console.log(error);
        });
        
    }



    const { type } = req.query;
    if (type && (type === "payment")) {
        const paymentID = req.body.data.id;

        axios.get(`https://api.mercadopago.com/v1/payments/${paymentID}`, 
            {headers: {"Authorization": "Bearer " + MERCADOPAGO_ACCESS_TOKEN}})
            .then(async function (response) {
                const payment = response.data;
                // console.log(" ============== PAYMENT NOTIFICATION ===================== ")
                // console.log(" PN: Order Nº: ",payment.order.id);
                // console.log(" PN: status: ",payment.status);
                // console.log(" PN: status_detail: ", payment.status_detail);

                if (payment.order.id && payment.status_detail) {
                        const responseMpState = await serviceOrders.updateMpState(payment.order.id, payment.status_detail);
                }

                if ((payment.status === "approved") || (payment.status === "accredited")) {
                    // envio de correo de pago aprovado
                    // const user = await serviceUsers.getById(payment.order.external_reference);

                }


                //console.log("response MP State: Order Nº", responseMpState);
               
            })
            .catch(function (error) {
            console.log(error);
        });
    }

    
    // devolucion a mercado pago despues de cada recepción de una notificacion.
    res.status(200).send("ok");
});

    
module.exports = router;



// ejemplo de como envia mercado pago una notificacion 
//  https://www.yoursite.com/notifications?topic=merchant_order&id=123456789
// ----------------------------------------------------------------------------------
//  con merchant_order se obtienen los datos del userId y los item del carrito
//  ---------> grabar order y order items
//  ------> state_order ---> creada.
//  ------> mp_status ---> opened.
// -------------------------------------------------
// actualizar el estado de la orden con las notificaciones paymet
// cuando EL ESTADO DE LA ORDEN es APROBADA,
// -------> se actualiza state_order ------> aprobed
// -------> se decuenta de stock los articulos 
// -------> se actualiza el estado de la orden aprobada
// -------------------------------------------------
// cuando el estado de la ORDEN es CANCELADA, 
// -------> se actualiza state_order ------> canceled 
// -------------------------------------------------
// cuando el estado de la ORDEN es PENDIENTE, 
// -------> se actualiza state_order ------> PENDIENTE DE PAGO
// -------------------------------------------------
// ENVIAR UN EMAIL AL USUARIO CON EL RESULTADO DE LA COMPRA
// -------------------------------------------------