const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('users', {
        first_name: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },
        last_name: {
            type: DataTypes.STRING(30),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(80),
            validate: {
                isEmail: true,
            },
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        address: {
            type: DataTypes.STRING(40),
            allowNull: true
        },
        cellphone: {
            type: DataTypes.INTEGER,
            validate: {
                isNumeric: true,
            },
            allowNull: true
        },
        location: { //municipio y/o localidad
            type: DataTypes.STRING(30),
            allowNull: true
        },
        department: { //estado provincial
            type: DataTypes.STRING(30),
            allowNull: true
        },
        zip_code: { //codigo postal
            type: DataTypes.STRING(20),
            allowNull: true
        },
        reset_password: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        state: {
            type: DataTypes.BOOLEAN, //* true = activo, false = inactivo soft_delete
        }
    });
};