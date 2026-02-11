exports.requireRole=(...roles)=>(req,res,next)=>{
if(!req.user)return res.status(401).json({error:'Not logged in'})
if(!roles.includes(req.user.role))return res.status(403).json({error:`Access denied. Required role: ${roles.join(' or ')}`})
next()
}
