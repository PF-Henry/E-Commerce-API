const { Router } = require('express');
const routerBrand = require('./brands');
const routerProducts = require('./products');
const routerCategories = require('./categories');



const router = Router();

// Configurar los routers
router.use('/brands', routerBrand);
router.use('/products', routerProducts);
router.use('/categories', routerCategories);


module.exports = router;