const { Router } = require('express');
const routerBrands = require('./brands');
const routerUsers = require('./users');
const routerImages = require('./images');


const router = Router();

// Configurar los routers
router.use('/brands', routerBrands);
router.use('/users', routerUsers);
router.use('/images', routerImages);


module.exports = router;