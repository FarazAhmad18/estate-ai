const {Favorite,Property,PropertyImage}=require('../models/index')

const toggle=async(req,res)=>{
    try{
        const userId=req.user.id
        const propertyId=parseInt(req.params.propertyId)

        const property=await Property.findByPk(propertyId)
        if(!property){
            return res.status(404).json({error:'Property not found'})
        }

        const existing=await Favorite.findOne({where:{user_id:userId,property_id:propertyId}})
        if(existing){
            await existing.destroy()
            return res.json({saved:false})
        }

        await Favorite.create({user_id:userId,property_id:propertyId})
        return res.json({saved:true})
    }catch(err){
        console.error('Toggle favorite error:',err)
        return res.status(500).json({error:'Server error'})
    }
}

const getMyFavorites=async(req,res)=>{
    try{
        const userId=req.user.id
        const page=parseInt(req.query.page)||1
        const limit=parseInt(req.query.limit)||12
        const offset=(page-1)*limit

        const {count,rows}=await Favorite.findAndCountAll({
            where:{user_id:userId},
            include:[{
                model:Property,
                include:[{
                    model:PropertyImage,
                }],
            }],
            order:[['createdAt','DESC']],
            limit,
            offset,
        })

        const properties=rows.map(fav=>fav.Property)

        return res.json({
            properties,
            totalCount:count,
            totalPages:Math.ceil(count/limit),
            currentPage:page,
        })
    }catch(err){
        console.error('Get favorites error:',err)
        return res.status(500).json({error:'Server error'})
    }
}

const checkFavorite=async(req,res)=>{
    try{
        const userId=req.user.id
        const propertyIds=(req.query.propertyIds||'')
            .split(',')
            .map(id=>parseInt(id))
            .filter(id=>!isNaN(id))

        if(propertyIds.length===0){
            return res.json({favoriteIds:[]})
        }

        const favorites=await Favorite.findAll({
            where:{
                user_id:userId,
                property_id:propertyIds,
            },
            attributes:['property_id'],
        })

        const favoriteIds=favorites.map(f=>f.property_id)
        return res.json({favoriteIds})
    }catch(err){
        console.error('Check favorite error:',err)
        return res.status(500).json({error:'Server error'})
    }
}

module.exports={toggle,getMyFavorites,checkFavorite}
