'use strict';

const { Brands } = require("../db.js");

class serviceBrands {
    constructor() {
        this.brands = [];
    }

    async getAll() {
        try {
            return await Brands.findAll({
            });
        } catch (error) {
            return error;
        }
    }

    async getById(id) {
        try{
            let brand = await Brands.findByPk(id);
            if(!brand) {
                throw {error: "Brand not found"}
            }
            return brand
        }catch(error){
            return error;
        }
        
    }


    async create(brand) {
        const { name, image } = brand;
        try {
            if (!name || !image) {
                throw {error: 'Name or Image is requerid field.'};
            }

            const regBrand = { name, image };

            const newBrand = await Brands.create(regBrand);

            return newBrand//{ msg: 'The brand was created successfully' };

        } catch (error) {
            return error;
        }
    }

    async update(id, name, image) {
        try{
            //console.log(id + " " + name + " " + image)
            let brand = Brands.findByPk(id);
            if(!brand){
                throw {error: "Brand not found"}
            }
            if(!name && !image){
                throw { error: 'Not found name and image' };
            }
            if(!name){
                let response = await Brands.update(
                    {
                        image: image,
                    },{
                    where: {
                        id: id,
                    }  
                }       
                )   
                if(response[0] === 1){
                    return {msg:"Update Brand sucessufully"}
                }     
            }
            if(!image){
                let response = await Brands.update(
                    {
                        name: name,
                    },{
                    where: {
                        id: id,
                    }  
                }       
                )  
                if(response[0] === 1){
                    return {msg:"Update Brand sucessufully"}
                }    
            }
            let response = await Brands.update(
            {
                name: name,
                image: image
            },{
            where: {
                id: id,
            }  
        }       
            )
            console.log(response)
            if(response[0] === 0){
                throw {error: "Brand not found"};
            }
            if(response[0] === 1){
                return {msg:"Update Brand sucessufully"}
            }
            
        } catch(error){
            return error
        }
    }

    async delete(id) {
        //console.log(id  + " el id es este")
        let response = await Brands.destroy({
            where: {
                id: id
            }
        });
        if(response === 0){
            throw {error: "Brand not found"};
        }
        return {msg:"Delete Brand sucessufully"}
    }
}

module.exports = serviceBrands;