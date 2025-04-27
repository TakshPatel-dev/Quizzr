import express from "express"
const route = express.Router()
import userLoginController from "../controllers/userLoginController.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
route.post("/user",userLoginController)

route.get("/user.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"../FRONTEND/register.html"))
})
export default route