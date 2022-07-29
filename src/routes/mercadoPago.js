const { Router } = require('express');
const router = Router();
const axios = require('axios');
const mercadopago = require("mercadopago");


const ServiceOrders = require('../services/Orders.js');
const serviceOrders = new ServiceOrders();


// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
    //access_token: process.env.MERCADOPAGO_ACCESS_TOKEN,
	access_token: "TEST-3352840888653824-082717-2089459f87c4aa1e9d28f7ea67610f6b-13551993", // qutiles.
});
  


router.post("/create_preference", (req, res) => {
	
    // obtener el nombre del servidor 
    const protocol = req.protocol;
    const SERVER_NAME = protocol + "://" + req.get("host") + "/api/mercadoPago";
    const HTTP_ORIGIN = req.headers.origin;
 
    // SE INICIA SERVIDOR CON ngrok y se obtiene el nombre del servidor para pruebas locales
    // const SERVER_HTTPS = "https://5aa8-179-48-255-180.sa.ngrok.io/api/mercadoPago";
    const SERVER_HTTPS = SERVER_NAME;

    console.log("SERVER_NAME: " + SERVER_NAME);
    console.log("HTTP_ORIGIN: " + HTTP_ORIGIN);
    console.log(" ----------------------------------- ");

    // DESTRUCTURACION DEL CARRITO -------------------------
    // const  userId  = req.body.userId;
    // const  orderItems = req.body.orderItems;

    // const preferenceOrderItem = orderItems.map(item => {
    //     return {
    //         title: item.name,
	//         unit_price: item.price,
	// 	    quantity: item.quantity,
    //     }
    // });
      
    
    // ARMADO DEL ARCHIVO DE PREFERENCIA  
	let preference = {
		//items: preferenceOrderItem,
        items: 
            [{
				title: "bicicleta 3 ruedas",
				unit_price: 152,
				quantity: 2,
			}],	
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
            console.log("PREFERENCE <-- MercadoPago: ", response.body);
            console.log("PREFERENCE <-- MercadoPago: ", response.body.id);


            // crear (order y orden item) para el usuario comprador **************
            // 
            const order = {
                "userId":1,
                //preferenceId: 13551993-cdd2a8d8-b9d8-4fdd-a6c5-50211cb92e7c     
                // agregar campo a la tabla de ordenes 
                "sell_date": "2022-07-25",
                "sell_time": "01:00:56",
                "total_sell": 150,
                "state": "created",
                "orders_items": []
            };

            const responseOrders = await serviceOrders.create(order);
            console.log("responseOrders: ", responseOrders);


			res.json({
				id: response.body.id,                   // se devuelve el id de la preferencia al frontend
                init_point: response.body.init_point    // se puede devolver el link de la preferencia
                                                        // init_point ?
			});
		}).catch(function (error) {
			console.log(error);
		});
});





// ejemplo de como envia mercado pago una notificacion 
//  https://www.yoursite.com/notifications?topic=merchant_order&id=123456789
// ----------------------------------------------------------------------------------
// 
// CAMBIAR EL ESTADO DE LA ORDEN A APROBADA,
// Y DESCONTAR DE STOCK LA CANTIDAD DE PRODUCTOS
// -------------------------------------------------
// ENVIAR UN EMAIL AL USUARIO CON EL RESULTADO DE LA COMPRA
// -------------------------------------------------

router.post("/notification", (req, res) => {
    console.log(req.body);
    console.log("NOTIFICACION");
    const { topic, id } = req.query;

    if (topic === "merchant_order") {
        // do something with the order id
        console.log(id);
        return res.send("OK");
    }

    //if (topic === "payment") {

        // obtener un pago de mercado pago
        // id 


        // obtener el pago de mercado pago
        // bearer token 

        axios.get(`https://api.mercadopago.com/v1/payments/${id}`,
            {
                headers: {
                    "Authorization": "Bearer " + "TEST-3352840888653824-082717-2089459f87c4aa1e9d28f7ea67610f6b-13551993"
                    }
                    }
            ).then(function (response) {
                console.log("response: ", response.data);
                // res.json(response.data);
                res.send("OK");
            }
        ).catch(function (error) {
            console.log(error);
        }
        );
    //}

        // curl -X GET \
        // 'https://api.mercadopago.com/v1/payments/{id}' \
        // -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 

    //     return res.send("OK");
    // }


    // devolucion a mercado pago de haber recibido la notificacion
    res.status(200).send("ok");
});

    
    
	// aca hay que guardar datos..
    // guardar datos en Orders asociar la order con el usuario de la compra
    // asociar cada item de la orden con Orders_Items y retornar al front.






module.exports = router;