export const generateToken = (user,message,statusCode,res) =>{
    const token = user.generateJsonWebToken();
    return res.
        status(statusCode).
        cookie("token",token,{
            expires : new Date(
                Date.now()+process.env.cookieExpire*1000*60*60*2
            ),
            httpOnly : true
        }).
        json({
            success : true,
            message : message,
            user,
            token,
        })

}