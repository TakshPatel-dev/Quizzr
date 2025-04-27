import jwt from "jsonwebtoken"
const verifyingJWT = (req,res,next)=>{
    const header = req.headers.Authorization || req.headers.authorization;
    if(!header){return res.status(401).send('Unauthorized please login again');}
    const token = header.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'},(err,decoded)=>{
    
        if(err){
            if(err.name === 'TokenExpiredError'){
                return res.status(403).json({"status":"403","message":"Token Expired Login Again"})
            }
            return res.status(403).send("Forbidden")
        }else{
            res.userId = decoded.userId;
            res.userName = decoded.userName
            next();
        }
    });


}
const verifyCookie = (req,res,next)=>{
    // console.log(req.cookies)
    const header = req.cookies.jwt
    if(!header){return res.status(401).send('Unauthorized please login again');}
    // const token = header.split(' ')[1];
    // console.log(token)
    jwt.verify(header,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1d'},(err,decoded)=>{
    
        if(err){
            if(err.name === 'TokenExpiredError'){
                return res.status(403).json({"status":"403","message":"Token Expired Login Again"})
            }
            console.log(err)
            return res.status(403).send("Forbidden")
        }else{
            res.userId = decoded.userId;
            res.userName = decoded.userName
            next();
        }
    });
}
export {verifyingJWT,verifyCookie}