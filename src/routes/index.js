const { Router } = require('express');
const routerBrand = require('./brands');
const routerReviews = require('./reviews');
const routerOrders = require('./orders');


const router = Router();

// Configurar los routers
router.use('/brands', routerBrand);
router.use('/reviews', routerReviews);
router.use('/orders', routerOrders);


module.exports = router;