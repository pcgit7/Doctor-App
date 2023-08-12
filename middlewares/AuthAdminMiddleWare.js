const User = require('../Models/userModel');

module.exports = async (req,res,next) => {

    try {
        const user = await User.findById(req.body.userId);
    if(user.isAdmin === false)
    {
        return res.status(401).send({
            message : "You are not allowed",
            success : false
    });
    }

  next();
    } catch (error) {
        return res.status(401).send({
            message : "Auth failed",
            success : false
           }) ;
    }
    
};