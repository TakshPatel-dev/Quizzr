import express from "express"
const route = express.Router()
// import path, { dirname } from "path"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import userRegisterController from "../controllers/userRegisterController.js"
route.post("/reg",userRegisterController)
route.use(express.static("./FRONTEND/public"))

route.get("/user.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"../FRONTEND/register.html"))
})
export default route