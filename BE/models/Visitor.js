const {DataTypes}=require('sequelize')
const sequelize=require('../config/db')

const Visitor=sequelize.define('Visitor',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    ip:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    path:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    method:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'GET',
    },
    user_agent:{
        type:DataTypes.TEXT,
        allowNull:true,
    },
    referrer:{
        type:DataTypes.STRING,
        allowNull:true,
    },
    user_id:{
        type:DataTypes.INTEGER,
        allowNull:true,
        references:{
            model:'users',
            key:'id',
        },
        onDelete:'SET NULL',
    },
},{
    tableName:'visitors',
    timestamps:true,
    indexes:[
        {fields:['createdAt'],name:'idx_visitor_created_at'},
        {fields:['user_id'],name:'idx_visitor_user_id'},
    ],
})

module.exports=Visitor
