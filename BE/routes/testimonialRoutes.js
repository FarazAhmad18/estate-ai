const express=require('express')
const router=express.Router()
const {getAll,create,remove}=require('../controllers/testimonialController')
const {auth}=require('../middlewares/authMiddleware')

router.get('/testimonials',getAll)
router.post('/testimonials',auth,create)
router.delete('/testimonials/:id',auth,remove)

module.exports=router
