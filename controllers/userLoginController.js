import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import con from "../config/connDB.js"

// const Elogger = require("../middleware/msgLogger")

const userLoginHandler = async (req,res)=>{
    console.log(req.body)
    const {usrName,password,rememberMe}=req.body;
    if(!usrName || !password){return res.status(400).json({"message":"usrName or Password not found","status":"400"});}
    try{
    const foundUsr = await con.query("SELECT * FROM userinfo WHERE userName = ?",[usrName])
        console.log(foundUsr)
    if(foundUsr[0].length == 0){return res.status(404).json({"status":"404","message":"User Not Registered"})};
    const verifyUserPwd = await bcrypt.compare(password,foundUsr[0][0].password);
    
    if(!verifyUserPwd){return res.status(401).json({"status":"401","message":"Incorrect Password"})};
    const jwtAccessToken = jwt.sign({"userId":foundUsr[0][0].userId,"userName":foundUsr[0][0].userName},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'3h'})
    res.cookie("jwt",jwtAccessToken,{maxAge: 3*60*60*100})    
    
    if(rememberMe){
        const jwtRefreshToken = jwt.sign({"userId":foundUsr[0][0].userId,"userName":foundUsr[0][0].userName},process.env.REFRESH_TOKEN_SECRET,{expiresIn:'28d'})   
        res.cookie("jwt2",jwtRefreshToken,{maxAge:28*24*60*60*100,httpOnly:true})
    }

    return res.json({'jwt':jwtAccessToken,'status':200});
}catch(error){
    throw error
}

}


export default userLoginHandler