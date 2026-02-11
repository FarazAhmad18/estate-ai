const Visitor=require('../models/Visitor')
const jwt=require('jsonwebtoken')

function extractUserId(req){
    try{
        const header=req.headers.authorization
        if(!header||!header.startsWith('Bearer ')) return null
        const token=header.split(' ')[1]
        const payload=jwt.verify(token,process.env.JWT_SECRET_KEY)
        return payload?.id||null
    }catch{
        return null
    }
}

function trackVisitor(req,res,next){
    // Skip logging for visitor endpoint to avoid recursive logging
    if(req.path==='/api/admin/visitors'){
        return next()
    }

    const user_id=extractUserId(req)

    // Fire-and-forget: don't await, don't block the request
    Visitor.create({
        ip:req.ip||req.connection?.remoteAddress||'unknown',
        path:req.originalUrl||req.url,
        method:req.method,
        user_agent:req.headers['user-agent']||null,
        referrer:req.headers['referer']||null,
        user_id,
    }).catch(()=>{})

    next()
}

module.exports={trackVisitor}
