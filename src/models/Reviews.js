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
                min: 0,
                max: 5
            },
            defaultValue: 0
        },
        verified:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });
};