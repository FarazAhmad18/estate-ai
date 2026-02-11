const {DataTypes}=require('sequelize')
const sequelize=require('../config/db')

const PropertyImage=sequelize.define('PropertyImage',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
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
    image_url:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    is_primary:{
        type:DataTypes.BOOLEAN,
        defaultValue:false,
    },
},{
    tableName:'property_images',
    timestamps:true,
})

module.exports=PropertyImage;
