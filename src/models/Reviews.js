const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('reviews', {
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        rating:{
            type: DataTypes.INTEGER,
            validate:{
                min: 1,
                max: 5
            },
            allowNull: false
        },
        id_product:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};