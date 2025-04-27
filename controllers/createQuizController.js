import mysql from "mysql2"
import con from "../config/connDB.js"
import fs from "fs/promises"
import fss from "fs"
import crypto from "crypto"
import path from "path"
import { fileURLToPath } from 'url';
import  "date-fns"
import { format } from "date-fns";
import { json } from "stream/consumers"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fetchQuiz = async (req,res)=>{

    if(!req.params.diff || !req.params.topic || !req.params.number){
        return res.status(301).json({"message":"bad request","status":"301"})
    }
    try{
    const quiz = await fetch(`https://quizapi.io/api/v1/questions?apiKey=${process.env.API_TOKEN}&category=${req.params.topic}&difficulty=${req.params.diff}&limit=${req.params.number}`)
    const quizResponse = await quiz.json()
    const Tdate = format(new Date(),"dd/MM/yyyy\tHH:mm:ss");
    const newResponse = {...quizResponse,quizMetaData:{createdBy:res.userId,"difficulty":req.params.diff,"topic":req.params.topic,"totalQuestions":req.params.number,createdAt:Tdate,description:req.params.description,time:req.params.time}}
    const uniqueNumber = crypto.randomInt(99999,999999)
    if(quizResponse.error){
        return res.status(304).json({"message":"No Questions Found","status":"304"})
    }

   const x =  await fs.writeFile(path.join(__dirname,"..","CreatedQuiz",`${uniqueNumber}.json`),JSON.stringify(newResponse),"utf-8")   
   con.query("INSERT INTO createdquizdata (quizId,userId,difficulty,topic,totlQuestions,createdAt,description,time,title) VALUES (?,?,?,?,?,?,?,?,?)",[uniqueNumber,res.userId,req.params.diff,req.params.topic,req.params.number,Tdate,req.params.description,req.params.time,req.params.title])
   return res.json({"status":200,message:"Quiz Created"})


}catch(e){
    return res.status(500).json({"message":"INTERNAL SERBER ERROR","status":"500"})
}

}

const storedQuiz =async (req,res)=>{
       const x = await con.query("SELECT * FROM createdquizdata WHERE userId = ?",[res.userId.toString()])

       if(!x){
        return res.json({"status":404,"message":"No Created Test's Found"})
       }
       return res.json(x[0])
       
}

const completeQuiz =async (req,res)=>{
    if(!req.body.quizId || !req.body.marks){
        return res.status(304).json({status:"304",message:"Quiz Is Not Available"})
    }
    try{
        const Tdate = format(new Date(),"dd/MM/yyyy\tHH:mm:ss");

    const x = await fs.readFile(path.join(__dirname,"..","CreatedQuiz",`${req.body.quizId}.json`),"utf8")
   const xx =JSON.parse(x)
   const newData = {...xx,marks:req.body.marks,answer:req.body.answers}
    await fs.writeFile(path.join(__dirname,"..","CompletedQuiz",`${req.body.quizId}.json`),JSON.stringify(newData),"utf8")
    fs.unlink(path.join(__dirname,"..","CreatedQuiz",`${req.body.quizId}.json`))
    con.query("INSERT INTO completedQuizData (quizId,userId,difficulty,topic,totlQuestions,completedAt,description,time,marks) VALUES(?,?,?,?,?,?,?,?,?)",[req.body.quizId,newData.quizMetaData.createdBy,newData.quizMetaData.difficulty,newData.quizMetaData.topic,newData.quizMetaData.totalQuestions,Tdate,newData.quizMetaData.description,newData.quizMetaData.time,newData.marks])
    con.query("DELETE FROM createdquizdata where quizId = ?",[req.body.quizId])
    return res.json({"status":200,message:"Quiz Given"})

    }catch(e){
        console.log(e);
        return res.status(500).json({"message":"INTERNAL SERBER ERROR","status":"500"})

    }
}

const displayQuiz = async (req,res)=>{
    if(!req.params.testId){
        return res.status(304).json({status:"304","message":"TEST ID NOT FOUND"})
    }
    try{
        console.log(req.params.testId)

        const x = fss.existsSync(path.join(__dirname,"..","CreatedQuiz",`${req.params.testId}.json`))
        if(!x){return res.status(404).json({status:"404","message":"QUIZ NOT FOUND CREATE AGAIN "})}
        const quizData = await fs.readFile(path.join(__dirname,"..","CreatedQuiz",`${req.params.testId}.json`),"utf8")
        const parsedData = (JSON.parse(quizData))
        return res.json(parsedData)
    }catch(e){
        console.log(e)
        return res.status(500).json({"status":500,"message":"INTERNAL SERVER ERROR"})
    }
   
    
}

const historyQuiz = async (req,res)=>{
    const userId = res.userId
   try{

   console.log(userId)
    if(!userId){
        return res.status(404).json({status:404,message:"UserId Not Found"})
    }
   const data = await con.query("SELECT * FROM completedquizdata WHERE userId = ?",[userId.toString()])
   return res.status(200).json(data[0])
    }catch(e){
        console.log(e)
        return res.status(500).json({"status":"500","message":"Internal SERBER ERROR"})
    }
}
const sendAnalysisFile =async (req,res)=>{
    try{
            
    const testId = req.body.quizId
    const x = await fs.readFile(path.join(__dirname,"..","CompletedQuiz",`${testId}.json`),"utf8")
    
    return res.json(JSON.parse(x))
        }catch(e){
            console.log(e)

            return res.status(500).json({"status":"500","message":"Internal Server Error"})
        }
}
export {fetchQuiz,storedQuiz,displayQuiz,completeQuiz,historyQuiz,sendAnalysisFile}