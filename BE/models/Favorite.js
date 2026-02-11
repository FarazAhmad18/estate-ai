const {DataTypes}=require('sequelize')
const sequelize=require('../config/db')

const Favorite=sequelize.define('Favorite',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'users',
            key:'id',
        },
        onDelete:'CASCADE',
    },
    property_id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:'properties',
            key:'id',
        },
        onDelete:'CASCADE',
    },
},{
    tableName:'favorites',
    timestamps:true,
    indexes:[
        {unique:true,fields:['user_id','property_id'],name:'idx_user_property_unique'},
    ],
})

module.exports=Favorite;
