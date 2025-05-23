import jwt from "jsonwebtoken"
import con from "../config/connDB.js";
const verifyingJWT = (req,res,next)=>{


    const header = req.headers.Authorization || req.headers.authorization;
    if(!header){
        return res.status(401).json({"message":"bad request","status":"401"})
    }

    const token = header.split(' ')[1];
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3h'},(err,decoded)=>{
    
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
const verifyCookie = async (req,res,next)=>{
    // console.log(req.cookies)
    let header = req.cookies.jwt

    if(!header){
     let result = await verifyRefreshToken(req,res,next)
     if(result == 0){
        return res.status(401).send('Unauthorized please login again');
     }
        header = result
        res.changedToken = true
        }
    // const token = header.split(' ')[1];
    // console.log(token)
    jwt.verify(header,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3h'},async (err,decoded)=>{
    
        if(err){
            
            if(err.name === 'TokenExpiredError'){
                     let result = await verifyRefreshToken(req,res,next)

                 if(result == 0){
                    return res.status(403).json({"status":"403","message":"Token Expired Login Again"})
             }
             next();
             return 
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

const verifyRefreshToken = async (req,res,next) =>{
    const refreshToken = req.cookies.jwt2
    if(!refreshToken){
        return 0       
    }
    let userName,userId
    
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,{expiresIn:'28d'},(err,decoded)=>{
        if(err){
            return err
        }else{
            
           userName =  decoded.userName
           userId = decoded.userId
           
           return 
        }
    })
    

    const data = await con.query("SELECT * FROM userinfo WHERE userId = ? AND userName = ?",[userId,userName])
    
    if(data[0][0]){
        
        const jwtAccessToken = jwt.sign({"userId":data[0][0].userId,"userName":data[0][0].userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3h'})
        res.cookie("jwt",jwtAccessToken,{maxAge: 3*60*60*100,httpOnly:false})
        console.log(jwtAccessToken,"HI")
        return jwtAccessToken

    }
    return 0
}
export {verifyingJWT,verifyCookie,verifyRefreshToken}