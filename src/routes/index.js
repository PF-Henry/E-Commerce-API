const express = require('express');
const routerReviews = require('./reviews');
const routerOrders = require('./orders');
const routerUsers = require('./users');
const routerImages = require('./images');
const routerBrands = require('./brands');
const routerProducts = require('./products');
const routerCategories = require('./categories');
const routerRoles = require('./roles');
const routerAuth = require('./auth');
const routerPermissions = require('./permissions');
const routerConfigDb = require('./configDb');
const routerFavorites = require('./favorites');
const routerMercadoPago = require('./mercadoPago');
const routerSubscribe = require('./subscribe');
const routerResetPassword = require('./resetPassword');


const router = express.Router();

// Configurar los routers //

router.use('/reviews', routerReviews);
router.use('/orders', routerOrders);
router.use('/users', routerUsers);
router.use('/images', routerImages);
router.use('/brands', routerBrands);
router.use('/products', routerProducts);
router.use('/categories', routerCategories);
router.use('/roles', routerRoles);
router.use('/auth', routerAuth);
router.use('/permissions', routerPermissions);
router.use('/configDb', routerConfigDb);
router.use('/favorites', routerFavorites);
router.use('/mercadoPago', routerMercadoPago);
router.use('/subscribe', routerSubscribe);
router.use('/resetPassword', routerResetPassword);


module.exports = router;