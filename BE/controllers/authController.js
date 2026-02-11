const User=require('../models/User')
const bcrypt=require('bcrypt')
const {signToken}=require('../utils/jwt')

 exports.register=async(req,res)=>{
    try{
    const {name,email,password,role}=req.body
    if(!name||!email||!password) return res.status(400).json({error:'name, email, and password are required'})
    const exists = await User.findOne({
  where: { email }
});

    if(exists) return res.status(409).json({error:'Email already registered'})
    const hash=await bcrypt.hash(password,10)
    const user=await User.create({name,email,password:hash,role:role||'Buyer'})
    const token=signToken(user)
    return res.status(200).json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role}})
    }
    catch(err)
    {
        console.error("Register error: ", err)
        res.status(500).json({error:'Server error during registration'})
    }
}
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body
        if(!email||!password) return res.status(400).json({error:'Email and password are required'})
        const user=await User.findOne({where:{email}})
        if(!user) return res.status(401).json({error:'Invalid email or password'})
        const ok=await bcrypt.compare(password,user.password)
       if(!ok)  return res.status(401).json({error:'Invalid email or password'})
       const token=signToken(user)
    res.status(200).json({token,user:{id:user.id,name:user.name,email:user.email,role:user.role}})
    }
    catch(e)
    {
        console.error("Login error: ", e)
        res.status(500).json({error:'Server error during login'})
    }
}
exports.profile=async(req,res)=>{
res.json({user:req.user})
}
exports.updateProfile=async(req,res)=>{
    try{
        const{name,email,phone}=req.body
        if(!name||!email) return res.status(400).json({error:'Name and email are required'})
        if(email!==req.user.email){
            const exists=await User.findOne({where:{email}})
            if(exists) return res.status(409).json({error:'Email already in use'})
        }
        await User.update({name,email,phone:phone||null},{where:{id:req.user.id}})
        const updated=await User.findByPk(req.user.id,{attributes:['id','name','email','role','phone','avatar_url']})
        res.json({user:updated})
    }catch(err){
        console.error("Update profile error:",err)
        res.status(500).json({error:'Server error updating profile'})
    }
}
