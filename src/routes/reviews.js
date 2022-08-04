const { Router } = require('express');
const router = Router();
const serviceReviews = require('../services/Reviews');
const services = new serviceReviews();

// retorna todas las reviews de dicho producto
// rating >0, 
router.get('/product/:productId', async(req, res, next) => {
    try {
        const productId = req.params.productId;
        const reviews = await services.findByProduct(productId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});


// retorna todas las reviews hechas por un usuario
// rating >0, de itemOrders
router.get('/user/:userId', async(req, res, next) => {
    try {
        const userId = req.params.userId;
        const reviews = await services.findByUser(userId);
        res.status(200).json(reviews);
    } catch (error) {
        next(error);
    }
});


//  en el body enviar :
// {
//    productId: 103,
//    userId: 103,
//    content: "Buen producto",
//    rating: 5,
// }   
//
router.put('/', async(req, res, next) => {
    try {
        const review = await services.updateReview(req.body);
        await review.update(req.body);
        res.status(200).json(review);
    } catch (error) {
        next(error);
    }
});



module.exports = router;