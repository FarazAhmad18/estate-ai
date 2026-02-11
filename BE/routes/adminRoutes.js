const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/authMiddleware')
const {getStats,getUsers,deleteUser,getProperties,deleteProperty,getTestimonials,deleteTestimonial,getVisitors}=require('../controllers/adminController')

function requireRole(role){
    return(req,res,next)=>{
        if(req.user?.role!==role){
            return res.status(403).json({error:'Access denied'})
        }
        next()
    }
}

router.use(auth,requireRole('Admin'))

router.get('/stats',getStats)
router.get('/users',getUsers)
router.delete('/users/:id',deleteUser)
router.get('/properties',getProperties)
router.delete('/properties/:id',deleteProperty)
router.get('/testimonials',getTestimonials)
router.delete('/testimonials/:id',deleteTestimonial)
router.get('/visitors',getVisitors)

module.exports=router
