const { Router } = require('express');
const router = Router();
const serviceBrands = require('../services/Brands');
const service = new serviceBrands();
//const { Brands, Products } = require('../db.js');



router.get('/', async(req, res, next) => {
    const name = req.query.name
    try {
        const response = await service.getAll(name);
        if(name){
            response.length ?
            res.status(200).send(response) :
            res.status(404).send({error:'This brand does not exist'})
        } else {
            res.status(200).json(response);
        }        
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async(req, res, next) => {
    let { id } = req.params;
    try {
        const response = await service.getById(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});

router.post('/', async(req, res, next) => {
    let body = req.body;
    try {
        const response = await service.create(body);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
})

router.put('/:id', async(req, res, next) => {
    try {
        const { name, image } = req.body;
        const { id } = req.params
        const response = await service.update(id, name, image);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})


router.delete('/:id', async(req, res, next) => {
    try {
        const { id } = req.params;
        const response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})



module.exports = router;