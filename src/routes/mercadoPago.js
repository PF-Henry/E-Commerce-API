const { Router } = require('express');
const router = Router();
const mercadopago = require("mercadopago");


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
    console.log("SERVER_NAME: " + SERVER_NAME);
    console.log("HTTP_ORIGIN: " + HTTP_ORIGIN);
    console.log(" ----------------------------------- ");

    // DESTRUCTURIN DEL CARRITO
    
    // ARMADO DEL ARCHIVO DE PREFERENCIA  

	let preference = {
		items: [
			{
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			},
            {
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			},
		],
		back_urls: {
			"success": `${HTTP_ORIGIN}/success.html`,
			"failure": `${HTTP_ORIGIN}/failure.html`,
			"pending": `${HTTP_ORIGIN}/pending.html`,
		},
        auto_return: "approved",
      //  notification_url: `${SERVER_NAME}/notification`,	
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
            console.log("PREFERENCE <-- MercadoPago: ", response.body);
            console.log("PREFERENCE <-- MercadoPago: ", response.body.id);
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

router.post("/notificacion", (req, res) => {
    console.log(req.body);
    const { topic, id } = req.body.query;
    if (topic === "merchant_order") {
        // do something with the order id
        console.log(id);
        return res.send("OK");
    }

    if (topic === "payment") {

        // obtener un pago de mercado pago
        // id 

        // curl -X GET \
        // 'https://api.mercadopago.com/v1/payments/{id}' \
        // -H 'Authorization: Bearer YOUR_ACCESS_TOKEN' 

        return res.send("OK");
    }


    // devolucion a mercado pago de haber recibido la notificacion
    res.status(200).send("ok");
});

    
    
	// aca hay que guardar datos..
    // guardar datos en Orders asociar la order con el usuario de la compra
    // asociar cada item de la orden con Orders_Items y retornar al front.






module.exports = router;