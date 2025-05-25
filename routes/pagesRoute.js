import express from "express"
const route = express.Router()
// import userLoginController from "../controllers/userLoginController.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// route.post("/user",userLoginController)
route.use(express.static("./FRONTEND/public"))
route.get("/Dashboard.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","Dashboard.html"))
})

route.get("/CreateQuiz.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","CreateQuiz.html"))
})

route.get("/History.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","History.html"))
})

route.get("/StoredQuiz.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","StoredQuiz.html"))
})
route.get("/Questions.html",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","Question.html"))
})
route.get("/historyAnalysis.html/",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","FRONTEND","historyAnalysis.html"))
})
export default route