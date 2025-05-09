import bcrypt from "bcrypt"
import con from "../config/connDB.js"
import crypto from "crypto"



const userRegisterController = async(req,res) => {
    // console.log(req.body)
    const {usrName,password,email} = req.body
    
    if(!usrName || !password || !email){
        return res.status(400).json({"message":"Incomplete Details","status":"400"})
    }
    try{
        const searchUsername = await con.query("SELECT * FROM userinfo WHERE userName = ?",[usrName])
        // console.log(searchUsername[0].length() == 0)
        if(!(searchUsername[0].length == 0)){
        return res.status(409).json({"message":"user already Exists!","status":"409"})
        }
        const newUserId = crypto.randomInt(9999999999,99999999999)
        console.log(newUserId)
        const encPwd = await bcrypt.hash(password,10)
        const createNewUser = await con.query("INSERT INTO userinfo (userId,userName,emailId,password) VALUES(?,?,?,?)",[newUserId,usrName,email,encPwd])
        if(createNewUser){
            return res.status(200).json({"message":"user Created","status":200})
        }
        console.log(createNewUser)
    }catch(e){
        throw e
    }

  
   
}


export default userRegisterController