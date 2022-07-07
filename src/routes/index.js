const { Router } = require('express');
const routerBrand = require('./brands');


const router = Router();

// Configurar los routers
router.use('/brands', routerBrand);


module.exports = router;