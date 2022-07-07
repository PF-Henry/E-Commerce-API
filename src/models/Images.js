const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('images', {
        url_image: {
            type: DataTypes.TEXT,
            allowNull: false,
            // unique: true  VOLVER A DESCOMENTAR DESPUES DE LAS PRUEBAS DEL FRONT
        }
    });
};