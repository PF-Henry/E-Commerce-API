const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define('orders', {
        sell_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            default: DataTypes.NOW
        },
        sell_time:{
            type: DataTypes.TIME,
            allowNull: false,
            default: DataTypes.NOW
        },
        total_sell:{
            type: DataTypes.FLOAT,
            validate:{
                min: 0
            },
            allowNull: false
        },
        state:{
            type: DataTypes.ENUM('created', 'processing', 'cancelled', 'complete'),
            allowNull: false,
            defaultValues: 'created'
        },
        mp_order_id:{
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        // valores posibles
        //  opened: Order without payments.
        //  closed: Order with payments covering total amount.
        //  expired: Canceled order that does not have approved or pending payments
        mp_status:{
            type: DataTypes.STRING(50),
            dafaultValue: '',
        },
        // valores posibles :   payment_required, reverted, paid, 
        //                      partially_reverted, partially_paid, 
        //                      payment_in_process, undefined, expired
        mp_order_status:{
            type: DataTypes.STRING(50),
            dafaultValue: '',
        }
    });
};