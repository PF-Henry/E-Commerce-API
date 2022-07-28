const { Router } = require('express');
const router = Router();
const mercadopago = require("mercadopago");

// REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel
mercadopago.configure({
	access_token: "TEST-3352840888653824-082717-2089459f87c4aa1e9d28f7ea67610f6b-13551993", // qutiles.
});
  

// router.use(express.urlencoded({ extended: false }));
// router.use(express.json());



// router.use(express.static("../../client"));

// router.get("/", function (req, res) {
//   res.status(200).sendFile("index.html");
// }); 

const CLIENT_URL = "http://127.0.0.1:5050";

let HTTP_ORIGIN = ""; 

let cookieRespuesta = {};

router.post("/create_preference", (req, res) => {
	
    // obtener el nombre del servidor 
    const protocol = req.protocol;
    const serverName = protocol + "://" + req.get("host") + "/api/mercadoPago";
    HTTP_ORIGIN = req.headers.origin;
    console.log("HTTP_ORIGIN: " + HTTP_ORIGIN);

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
            {
				title: req.body.description,
				unit_price: Number(req.body.price),
				quantity: Number(req.body.quantity),
			}
		],
		back_urls: {
			"success": `${serverName}/feedbacksuccess`,
			"failure": `${serverName}/feedbackfailure`,
			"pending": `${serverName}/feedbackpending`,
		},
        auto_return: "approved",
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({
				id: response.body.id   // se devuelve el id de la preferencia al frontend
			});
		}).catch(function (error) {
			console.log(error);
		});
});

router.get('/feedbacksuccess', function(req, res) {

    const protocol = req.protocol;
    const serverName = protocol + "://" + req.get("host") + "/api/mercadoPago";
    console.log("feedbacksuccess: AHORA GRABO LA ORDEN Y REGRESO", serverName);

    // CAMBIAR EL ESTADO DE LA ORDEN A APROBADA,
    // Y DESCONTAR DE STOCK LA CANTIDAD DE PRODUCTOS
    // -------------------------------------------------
    // ENVIAR UN EMAIL AL USUARIO CON EL RESULTADO DE LA COMPRA
    // -------------------------------------------------
    // ENVIAR AL FRONTEND EL RESULTADO DE LA COMPRA
    // -------------------------------------------------
    // REDIRECCIONAR AL USUARIO AL FRONTEND
    // -------------------------------------------------

	// aca hay que guardar datos..
    // guardar datos en Orders asociar la order con el usuario de la compra
    // asociar cada item de la orden con Orders_Items y retornar al front.

	// res.json({
	// 	Payment: req.query.payment_id,
	// 	Status: req.query.status,
	// 	MerchantOrder: req.query.merchant_order_id
	// });

    const respuesta = {
		Payment: req.query.payment_id,
		Status: req.query.status,
		MerchantOrder: req.query.merchant_order_id
	};
    res.cookie("respuesta", respuesta);
    res.redirect(`${serverName}/mercadoPago/callbackSuccess`);
});


router.get('/callbackSuccess', function(req, res) {
    
    if (req.headers.origin !== CLIENT_URL) {
        console.log("CLIENTE_URL <======= 1 " );
        if (req.cookies.respuesta) {
            cookieRespuesta = req.cookies.respuesta;
            //res.clearCookie('respuesta');
            console.log("redirect : al origen <======= 2 ");
            return res.redirect(`${CLIENT_URL}/`);
        }
    }
    if (req.headers.origin === CLIENT_URL) {
        // setTimeout(() => {
        //     cookie = {};
        // }, 5000);
        return res.json(cookieRespuesta);
    }


});




// router.get('/feedbackfailure', function(req, res) {

// 	// aca hay que guardar datos..
// 	// y retornar al front.

// 	res.json({
// 		Payment: req.query.payment_id,
// 		Status: req.query.status,
// 		MerchantOrder: req.query.merchant_order_id
// 	});
// });



// router.get('/feedbackpending', function(req, res) {

// 	// aca hay que guardar datos..
// 	// y retornar al front.

// 	res.json({
// 		Payment: req.query.payment_id,
// 		Status: req.query.status,
// 		MerchantOrder: req.query.merchant_order_id
// 	});
// });


module.exports = router;