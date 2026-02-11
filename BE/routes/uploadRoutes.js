const express=require('express')
const router=express.Router()
const multer=require('multer')
const {auth}=require('../middlewares/authMiddleware')
const {requireRole}=require('../middlewares/roleMiddleware')
const {uploadAvatar,uploadPropertyImages,deletePropertyImage,getPropertyImages}=require('../controllers/uploadController')

const upload=multer({
    storage:multer.memoryStorage(),
    limits:{fileSize:5*1024*1024}, // 5MB per file
    fileFilter:(req,file,cb)=>{
        if(file.mimetype.startsWith('image/')) cb(null,true)
        else cb(new Error('Only image files are allowed'),false)
    },
})

router.put('/profile/avatar',auth,upload.single('avatar'),uploadAvatar)
router.post('/properties/:id/images',auth,requireRole('Agent'),upload.array('images',10),uploadPropertyImages)
router.delete('/properties/:id/images/:imageId',auth,requireRole('Agent'),deletePropertyImage)
router.get('/properties/:id/images',getPropertyImages)

module.exports=router
