const express = require('express');
const routerReviews = require('./reviews');
const routerOrders = require('./orders');
const routerUsers = require('./users');
const routerImages = require('./images');
const routerBrands = require('./brands');
const routerProducts = require('./products');
const routerCategories = require('./categories');


const router = express.Router();

// Configurar los routers

router.use('/reviews', routerReviews);
router.use('/orders', routerOrders);
router.use('/users', routerUsers);
router.use('/images', routerImages);
router.use('/brands', routerBrands);
router.use('/products', routerProducts);
router.use('/categories', routerCategories);



module.exports = router;