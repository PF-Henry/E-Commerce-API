const { Sequelize, DataTypes } = require('sequelize');
//const sequelize = new Sequelize();
const { conn } = require('../db.js');
const queryInterface = conn.getQueryInterface();



class serviceConfigDb {
    constructor() {
        
    }


    async getAlterColumn() {

        try {
            
            const table = "users";
            const column = "password";
            const typeColumn = {
                            type: DataTypes.STRING(64),
                            allowNull: false }

            queryInterface.changeColumn(table, column, typeColumn);
            return 'Column updated';
        } catch(err) {
             
            console.log('Column error', err);   
            return err;
        };       
        
    }


    // addColumn
    //changeColumn 
    // removeColumn 
    // createTable 



}


module.exports = serviceConfigDb;