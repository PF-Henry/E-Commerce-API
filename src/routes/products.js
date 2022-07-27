const { Router, response } = require('express');
const router = Router();

// ---------------------------------- implementation upload ----------------------------------
const multer = require('multer');
const storaStrategy = multer.memoryStorage();
const upload = multer({ storage: storaStrategy });
const { dirname } = require('path');
// ---------------------------------- implementation upload ----------------------------------



const serviceProducts = require('../services/Products.js');
const service = new serviceProducts();

// const { Products } = require('../db.js');


router.get('/', async(req, res, next) => {
    const { name, category } = req.query;
    try {
        const response = await service.getAll(name, category);
        res.status(200).json(response);
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


router.post('/', upload.array('fileName'), async(req, res, next) => {
    
    let body = req.body;
    try {
        const response = await service.create(body, req);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
});

//router.put('/:id', async(req, res, next) => {
router.put('/:id', upload.array('fileName'), async(req, res, next) => {    
    let { id } = req.params;
    let body = req.body;
    try {
        const response = await service.update(id, body, req);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
})

router.delete('/:id', async(req, res, next) => {
    let { id } = req.params;

    try {
        const response = await service.delete(id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
});


router.get('/images/:image', (req, res, next) => {
    const image = req.params.image;
    try{
        res.sendFile(process.cwd()+`/optimized/${image}`, (err) => {
            if(err){
                res.sendFile(process.cwd()+"/optimized/no-image-available.jpg");
            }
        }
        );
    } catch(error){
        next(error);
    }    
});



module.exports = router;