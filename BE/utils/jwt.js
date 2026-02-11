const jwt=require('jsonwebtoken')
require('dotenv').config()

function signToken(user){
return jwt.sign(
    {id:user.id,role:user.role},
    process.env.JWT_SECRET_KEY,
    {
        expiresIn:'7d'
    }
)
}
module.exports= {signToken}