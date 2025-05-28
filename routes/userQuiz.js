import express from "express"
const route = express.Router()
import path from 'path';
import { fileURLToPath } from 'url';
import {fetchQuiz,storedQuiz,historyQuiz,displayQuiz,completeQuiz, sendAnalysisFile} from "../controllers/createQuizController.js";
import { dashboardGraphParams } from "../controllers/dashboardParmas.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

route.get("/dashboard/getGraphsParams",dashboardGraphParams)
route.get("/fetchQuiz/:topic/:diff/:number/:description/:time/:title",fetchQuiz)
route.get("/fetchQuiz/storedQuiz",storedQuiz)
route.get("/fetchQuiz/startQuiz/:testId",displayQuiz)
route.post("/fetchQuiz/completedQuiz/",completeQuiz)
route.get("/fetchQuiz/HistoryQuiz/",historyQuiz)
route.post("/fetchQuiz/getAnalysis/",sendAnalysisFile)

export default route