const { Router } = require('express');

const routerUsers = require('./users');
const routerImages = require('./images');
const routerBrands = require('./brands');
const routerProducts = require('./products');
const routerCategories = require('./categories');

const router = Router();

// Configurar los routers

router.use('/users', routerUsers);
router.use('/images', routerImages);
router.use('/brands', routerBrands);
router.use('/products', routerProducts);
router.use('/categories', routerCategories);


module.exports = router;