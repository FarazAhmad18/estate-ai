const supabase=require('../config/supabase')
const User=require('../models/User')
const Property=require('../models/Property')
const PropertyImage=require('../models/PropertyImage')
const crypto=require('crypto')
const path=require('path')

exports.uploadAvatar=async(req,res)=>{
    try{
        if(!req.file) return res.status(400).json({error:'No file uploaded'})

        const userId=req.user.id
        const ext=path.extname(req.file.originalname)||'.jpg'
        const filePath=`${userId}/avatar${ext}`

        const {error:uploadError}=await supabase.storage
            .from('avatars')
            .upload(filePath,req.file.buffer,{
                contentType:req.file.mimetype,
                upsert:true,
            })

        if(uploadError) return res.status(500).json({error:uploadError.message})

        const {data}=supabase.storage.from('avatars').getPublicUrl(filePath)
        const avatar_url=data.publicUrl

        await User.update({avatar_url},{where:{id:userId}})

        const user=await User.findByPk(userId,{
            attributes:['id','name','email','role','avatar_url'],
        })

        return res.status(200).json({user})
    }
    catch(e){
        console.error("Upload avatar error:",e)
        return res.status(500).json({error:'Failed to upload avatar'})
    }
}

exports.uploadPropertyImages=async(req,res)=>{
    try{
        const propertyId=req.params.id
        if(!req.files||req.files.length===0) return res.status(400).json({error:'No files uploaded'})

        const property=await Property.findByPk(propertyId)
        if(!property) return res.status(404).json({error:'Property not found'})
        if(property.agent_id!==req.user.id) return res.status(403).json({error:'You do not own this property'})

        const existingImages=await PropertyImage.findAll({where:{property_id:propertyId}})
        const hasPrimary=existingImages.some(img=>img.is_primary)

        const uploaded=[]
        for(let i=0;i<req.files.length;i++){
            const file=req.files[i]
            const uuid=crypto.randomUUID()
            const ext=path.extname(file.originalname)||'.jpg'
            const filePath=`${propertyId}/${uuid}${ext}`

            const {error:uploadError}=await supabase.storage
                .from('property-images')
                .upload(filePath,file.buffer,{
                    contentType:file.mimetype,
                })

            if(uploadError){
                console.error("Storage upload error:",uploadError)
                continue
            }

            const {data}=supabase.storage.from('property-images').getPublicUrl(filePath)

            const image=await PropertyImage.create({
                property_id:propertyId,
                image_url:data.publicUrl,
                is_primary:!hasPrimary&&i===0,
            })
            uploaded.push(image)
        }

        return res.status(201).json({images:uploaded})
    }
    catch(e){
        console.error("Upload property images error:",e)
        return res.status(500).json({error:'Failed to upload images'})
    }
}

exports.deletePropertyImage=async(req,res)=>{
    try{
        const {id,imageId}=req.params

        const property=await Property.findByPk(id)
        if(!property) return res.status(404).json({error:'Property not found'})
        if(property.agent_id!==req.user.id) return res.status(403).json({error:'You do not own this property'})

        const image=await PropertyImage.findOne({where:{id:imageId,property_id:id}})
        if(!image) return res.status(404).json({error:'Image not found'})

        // Extract storage path from public URL and delete from storage
        const urlParts=image.image_url.split('/property-images/')
        if(urlParts[1]){
            await supabase.storage.from('property-images').remove([urlParts[1]])
        }

        await image.destroy()

        return res.status(200).json({msg:'Image deleted successfully'})
    }
    catch(e){
        console.error("Delete property image error:",e)
        return res.status(500).json({error:'Failed to delete image'})
    }
}

exports.getPropertyImages=async(req,res)=>{
    try{
        const images=await PropertyImage.findAll({
            where:{property_id:req.params.id},
            order:[['is_primary','DESC'],['createdAt','ASC']],
        })
        return res.status(200).json({images})
    }
    catch(e){
        console.error("Get property images error:",e)
        return res.status(500).json({error:'Failed to fetch images'})
    }
}
