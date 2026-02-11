const express=require('express')
const router=express.Router()
const {auth}=require('../middlewares/authMiddleware')
const {toggle,getMyFavorites,checkFavorite}=require('../controllers/favoriteController')

router.post('/favorites/:propertyId',auth,toggle)
router.get('/favorites',auth,getMyFavorites)
router.get('/favorites/check',auth,checkFavorite)

module.exports=router
