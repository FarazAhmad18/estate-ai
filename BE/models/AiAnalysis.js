const {DataTypes}=require('sequelize')
const sequelize=require('../config/db')

const AiAnalysis=sequelize.define('AiAnalysis',{
id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
},
  property_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique:true,
    references:{
        model:'properties',
        key:'id',

    },
    onDelete:'CASCADE'
  },
    ai_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  ai_insights:{
    type:DataTypes.TEXT,
    allowNull:false,
  },


},{
    tableName:'ai_analysis',
    timestamps:true,
    createdAt:'generated_at',
    updatedAt:false,
})
module.exports=AiAnalysis