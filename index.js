import dotenv from "dotenv"
import express from "express"
import cors from "cors"
import userRegisterRoute from "./routes/userRegisterRoute.js"
import userLoginRoute from "./routes/userLoginRoute.js"
import {verifyingJWT,verifyCookie} from "./middlewares/verifyJWT.js"
import quizRoute from "./routes/userQuiz.js"
import quizHtmlRoute from "./routes/pagesRoute.js"
import cookieParser from "cookie-parser"
// import path from "path"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(__dirname);
const app = express()
dotenv.config()
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:false}))

app.get('/',(req,res)=>{
    res.redirect("/register/user.html")
})
app.use("/register/",userRegisterRoute)
app.use("/login",userLoginRoute)

app.use("/quizQuest",verifyCookie,quizHtmlRoute)
app.use(verifyingJWT)

app.use("/quiz",quizRoute)


app.listen(5000,()=>{console.log("Server running on prot 5000")})