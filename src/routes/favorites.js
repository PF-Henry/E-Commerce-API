const { Router } = require('express');
const router = Router();
const serviceFavorites = require('../services/Favorites');
const service = new serviceFavorites();


// add a new favorite
router.put('/add', async(req, res, next) => {
    let body = req.body;
    try {
        const response = await service.addFavourite(body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}
);


// add a new favorite
router.put('/remove', async(req, res, next) => {
    let body = req.body;
    try {
        const response = await service.removeFavourite(body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}   // end of post
);

// get all los productos favorites de un usuario
router.get('/user/:userId', async(req, res, next) => {
    let userId = req.params.userId;
    try {
        const response = await service.getFavoritesByUser(userId);
        res.status(200).json(response);
        } catch (error) {
            next(error);
        }
    }   // end of get
);

// get all usuarios de un producto favorito
router.get('/product/:productId', async(req, res, next) => {
    let productId = req.params.productId;
    try {
        const response = await service.getFavoritesByProudct(productId);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}   // end of get
);


module.exports = router;