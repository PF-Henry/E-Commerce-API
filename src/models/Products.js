const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('products', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false
        },
        technical_description:{
            type: DataTypes.TEXT,
            allowNull: false
        },
        Price:{
            type: DataTypes.FLOAT,
            allowNull: false
        },
        stock:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};