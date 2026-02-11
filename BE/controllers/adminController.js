const {Op}=require('sequelize')
const {User,Property,Testimonial,Visitor,PropertyImage}=require('../models')

// GET /api/admin/stats
async function getStats(req,res){
    try{
        const now=new Date()
        const todayStart=new Date(now.getFullYear(),now.getMonth(),now.getDate())
        const weekAgo=new Date(todayStart)
        weekAgo.setDate(weekAgo.getDate()-7)

        const [totalUsers,totalProperties,totalTestimonials,visitorsToday,visitorsThisWeek,newUsersThisWeek]=await Promise.all([
            User.count(),
            Property.count(),
            Testimonial.count(),
            Visitor.count({where:{createdAt:{[Op.gte]:todayStart}}}),
            Visitor.count({where:{createdAt:{[Op.gte]:weekAgo}}}),
            User.count({where:{createdAt:{[Op.gte]:weekAgo}}}),
        ])

        res.json({totalUsers,totalProperties,totalTestimonials,visitorsToday,visitorsThisWeek,newUsersThisWeek})
    }catch(err){
        console.error('Admin getStats error:',err)
        res.status(500).json({error:'Failed to fetch stats'})
    }
}

// GET /api/admin/users?search=
async function getUsers(req,res){
    try{
        const {search}=req.query
        const where=search?{
            [Op.or]:[
                {name:{[Op.like]:`%${search}%`}},
                {email:{[Op.like]:`%${search}%`}},
            ]
        }:{}

        const users=await User.findAll({
            where,
            attributes:{exclude:['password']},
            order:[['createdAt','DESC']],
        })
        res.json(users)
    }catch(err){
        console.error('Admin getUsers error:',err)
        res.status(500).json({error:'Failed to fetch users'})
    }
}

// DELETE /api/admin/users/:id
async function deleteUser(req,res){
    try{
        const {id}=req.params
        if(parseInt(id)===req.user.id){
            return res.status(400).json({error:'Cannot delete yourself'})
        }
        const user=await User.findByPk(id)
        if(!user) return res.status(404).json({error:'User not found'})
        await user.destroy()
        res.json({message:'User deleted'})
    }catch(err){
        console.error('Admin deleteUser error:',err)
        res.status(500).json({error:'Failed to delete user'})
    }
}

// GET /api/admin/properties?search=&page=&limit=
async function getProperties(req,res){
    try{
        const {search,page=1,limit=20}=req.query
        const offset=(parseInt(page)-1)*parseInt(limit)
        const where=search?{location:{[Op.like]:`%${search}%`}}:{}

        const {count,rows}=await Property.findAndCountAll({
            where,
            include:[
                {model:User,attributes:['id','name','email','avatar_url']},
                {model:PropertyImage,limit:1,order:[['is_primary','DESC'],['id','ASC']]},
            ],
            order:[['createdAt','DESC']],
            limit:parseInt(limit),
            offset,
        })

        res.json({
            properties:rows,
            total:count,
            page:parseInt(page),
            totalPages:Math.ceil(count/parseInt(limit)),
        })
    }catch(err){
        console.error('Admin getProperties error:',err)
        res.status(500).json({error:'Failed to fetch properties'})
    }
}

// DELETE /api/admin/properties/:id
async function deleteProperty(req,res){
    try{
        const property=await Property.findByPk(req.params.id)
        if(!property) return res.status(404).json({error:'Property not found'})
        await property.destroy()
        res.json({message:'Property deleted'})
    }catch(err){
        console.error('Admin deleteProperty error:',err)
        res.status(500).json({error:'Failed to delete property'})
    }
}

// GET /api/admin/testimonials
async function getTestimonials(req,res){
    try{
        const testimonials=await Testimonial.findAll({
            include:[{model:User,attributes:['id','name','email','avatar_url']}],
            order:[['createdAt','DESC']],
        })
        res.json(testimonials)
    }catch(err){
        console.error('Admin getTestimonials error:',err)
        res.status(500).json({error:'Failed to fetch testimonials'})
    }
}

// DELETE /api/admin/testimonials/:id
async function deleteTestimonial(req,res){
    try{
        const testimonial=await Testimonial.findByPk(req.params.id)
        if(!testimonial) return res.status(404).json({error:'Testimonial not found'})
        await testimonial.destroy()
        res.json({message:'Testimonial deleted'})
    }catch(err){
        console.error('Admin deleteTestimonial error:',err)
        res.status(500).json({error:'Failed to delete testimonial'})
    }
}

// GET /api/admin/visitors?page=&limit=
async function getVisitors(req,res){
    try{
        const {page=1,limit=50}=req.query
        const offset=(parseInt(page)-1)*parseInt(limit)
        const weekAgo=new Date()
        weekAgo.setDate(weekAgo.getDate()-7)

        const {count,rows}=await Visitor.findAndCountAll({
            where:{createdAt:{[Op.gte]:weekAgo}},
            include:[{model:User,attributes:['id','name','email'],required:false}],
            order:[['createdAt','DESC']],
            limit:parseInt(limit),
            offset,
        })

        res.json({
            visitors:rows,
            total:count,
            page:parseInt(page),
            totalPages:Math.ceil(count/parseInt(limit)),
        })
    }catch(err){
        console.error('Admin getVisitors error:',err)
        res.status(500).json({error:'Failed to fetch visitors'})
    }
}

module.exports={getStats,getUsers,deleteUser,getProperties,deleteProperty,getTestimonials,deleteTestimonial,getVisitors}
