const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('images', {
        image: {
            type: DataTypes.STRING(80),
            allowNull: false,
            unique: true
        },
        id_product:{
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
};