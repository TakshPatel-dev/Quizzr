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
                    "SELECT topic,marks FROM completedQuizData WHERE userId = ? AND completedAt = (SELECT MAX(completedAt) FROM completedQuizData WHERE userId = ? AND topic = ?);",
                    [res.userId, res.userId, obj.topic]
                );
                return latestMarks[0][0].marks;
            })
        );
        return res.status(200).json({quizTrendCard:quizTrendCard[0],uniqueQuizDifficultyCreatedData:uniqueQuizDifficultyCreatedData[0],uniqueQuizTopicCreatedData:uniqueQuizTopicCreatedData[0],latestMarks:tempArr})

    


    }catch(e){
        console.log(e)
        return res.status(500).json({"status":"500","message":"Internal Server Error Please Try Again Later"})
    }
   
    
    


}

export {dashboardGraphParams}