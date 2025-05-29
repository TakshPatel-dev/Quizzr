import con from "../config/connDB.js"


const dashboardGraphParams = async (req,res)=>{
    
    try{
        if(!res.userId){return res.status(403).json({"status":"403","message":"The UserId not Found"})}
    const uniqueQuizTopicCreatedData = await con.query("SELECT DISTINCT(topic),COUNT(topic) AS totalQuiz,SUM(totlQuestions) AS totalQuestion FROM completedQuizData WHERE userId = ? GROUP BY topic;",[res.userId])
    const uniqueQuizDifficultyCreatedData = await con.query("SELECT DISTINCT(difficulty),COUNT(difficulty) AS totalQuiz,SUM(totlQuestions) AS totalQuestion FROM completedQuizData WHERE userId = ? GROUP BY difficulty;",[res.userId])    
    const quizTrendCard = await con.query("SELECT DISTINCT(topic),AVG(totlQuestions) AS avgTotlQuestions,AVG(marks) AS avgMarks,COUNT(topic) AS totalQuiz ,MAX(completedAt) FROM completedQuizData WHERE userId = ? GROUP BY topic;",[res.userId])
     const tempArr = await Promise.all(
            quizTrendCard[0].map(async (obj) => {
                const latestMarks = await con.query(
                    "SELECT topic,marks,totlQuestions FROM completedQuizData WHERE userId = ? AND completedAt = (SELECT MAX(completedAt) FROM completedQuizData WHERE userId = ? AND topic = ?);",
                    [res.userId, res.userId, obj.topic]
                );
                console.log( parseFloat(latestMarks[0][0].marks) / parseFloat(latestMarks[0][0].totlQuestions) * 100)
                return parseFloat(latestMarks[0][0].marks) / parseFloat(latestMarks[0][0].totlQuestions) * 100;
            })
        );


            const LastQuizCreated = await con.query("SELECT topic,totlQuestions,createdAt FROM createdQuizData WHERE userId = ? AND createdAt = (SELECT MAX(createdAt) FROM createdQuizData WHERE userId = ? );",[res.userId,res.userId])
            const LastQuizCompleted = await con.query("SELECT topic,marks,totlQuestions,completedAt FROM completedQuizData WHERE userId = ? AND completedAt = (SELECT MAX(completedAt) FROM completedQuizData WHERE userId = ? );",[res.userId,res.userId])
            console.log(LastQuizCompleted[0])
            console.log(LastQuizCreated[0])
            return res.status(200).json({quizTrendCard:quizTrendCard[0],uniqueQuizDifficultyCreatedData:uniqueQuizDifficultyCreatedData[0],uniqueQuizTopicCreatedData:uniqueQuizTopicCreatedData[0],latestMarks:tempArr,LastQuizCompleted:LastQuizCompleted[0],LastQuizCreated:LastQuizCreated[0]})

    


    }catch(e){
        console.log(e)
        return res.status(500).json({"status":"500","message":"Internal Server Error Please Try Again Later"})
    }
   
    
    


}

export {dashboardGraphParams}