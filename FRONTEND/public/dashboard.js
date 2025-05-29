        document.addEventListener("DOMContentLoaded",()=>{
        setTkn()
    })
    function setTkn(){
        if(sessionStorage.getItem("jwt") != document.cookie.split('=')[1]){
            console.log("changed",document.cookie.split('=')[1])
            sessionStorage.setItem("jwt",document.cookie.split('=')[1]) 
        }
    }

    async function getDataForGraphs(){

        const graphData = await fetch("http://127.0.0.1:5000/quiz/dashboard/getGraphsParams",{
            headers:{"Content-Type":"Application/json",Authorization:`Bearer ${sessionStorage.getItem("jwt")}`}
         })
        const graphDataResponse = await graphData.json()
    
            const modifiedGraphDataResponse = {languageLabel : [],languageData: [],difficultyLabel:[],difficultyData:[],quizTrendCardTopic:[],quizTrendCardAvgMarks:[],quizTrendCardTotalQuiz:[],latestMarks:graphDataResponse.latestMarks}

        graphDataResponse.uniqueQuizTopicCreatedData.forEach(obj => {
            modifiedGraphDataResponse.languageLabel.push(obj.topic)
            modifiedGraphDataResponse.languageData.push(obj.totalQuiz)
        })
        graphDataResponse.uniqueQuizDifficultyCreatedData.forEach(obj => {
            modifiedGraphDataResponse.difficultyLabel.push(obj.difficulty)
            modifiedGraphDataResponse.difficultyData.push(obj.totalQuiz)
        })

        graphDataResponse.quizTrendCard.forEach(obj =>{
            modifiedGraphDataResponse.quizTrendCardTopic.push(obj.topic)
            modifiedGraphDataResponse.quizTrendCardAvgMarks.push((parseFloat(obj.avgMarks)/parseFloat(obj.avgTotlQuestions)) * 100)
            modifiedGraphDataResponse.quizTrendCardTotalQuiz.push(obj.totalQuiz)
        })

        if (modifiedGraphDataResponse.languageLabel.length === 0 && modifiedGraphDataResponse.difficultyLabel.length === 0){
            return 0
        }
        return modifiedGraphDataResponse
    }
    
      
    async function displayGraphs(flag){
    datae = await getDataForGraphs()
    console.log(datae)
    if(datae === 0){
       const chartCont = document.querySelectorAll(".chart-container")
       const tableCont = document.querySelector(".table-container")
       Array.from(chartCont).forEach(ele=>{
        ele.innerHTML = "<h4> Give atleast 1 test for analysis </h4>"
       })
       tableCont.innerHTML = '<h4> Give atleast 1 test for analysis </h4>'
        return 0
    }   
    if(flag){
         const monthlyActivityCtx = document.getElementById('monthlyActivityChart').getContext('2d');
        new Chart(monthlyActivityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Quizzes',
                    data: [5, 8, 4, 10, 15, 25, 20, 18, 22, 12, 16, 10],
                    borderColor: '#2dd4bf',
                    backgroundColor: 'rgba(45, 212, 191, 0.2)',
                    fill: true
                }, {
                    label: 'Questions',
                    data: [10, 15, 8, 20, 30, 40, 35, 30, 28, 18, 22, 15],
                    borderColor: '#60a5fa',
                    backgroundColor: 'rgba(96, 165, 250, 0.2)',
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: '#e5e7eb' },
                        grid: { color: '#4b5563' }
                    },
                    x: {
                        ticks: { color: '#e5e7eb' },
                        grid: { color: '#4b5563' }
                    }
                },
                plugins: {
                    legend: { labels: { color: '#e5e7eb' } }
                }
            }
        });

        // Language Distribution Chart
        const languageDistributionCtx = document.getElementById('languageDistributionChart').getContext('2d');
        new Chart(languageDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: datae.languageLabel,
                datasets: [{
                    data: datae.languageData,
                }]
            },
                
            options: {
                cutout: '70%',
                plugins:{
                labels: {
                render: 'label'
                }
}
            }
        });

        // Difficulty Distribution Chart
        const difficultyDistributionCtx = document.getElementById('difficultyDistributionChart').getContext('2d');
        new Chart(difficultyDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: datae.difficultyLabel,
                datasets: [{
                    data: datae.difficultyData,
                }]
            },
            options: {
                cutout: '70%',
                plugins: { legend: { display: true } }
            }
        });
    }
       
          // Monthly Activity Chart
       

        const quizTrendCard = document.getElementById("quizTrendCard")
        quizTrendCard.innerHTML = ''
        datae.quizTrendCardTopic.forEach((ele,index) => {

            if(index >= 3 && flag){
                return 
            }
            let tr = document.createElement("tr")
            let topic = document.createElement("td")
            let totlQuiz = document.createElement("td")
            let averageMarks = document.createElement("td")
            let trend = document.createElement("td")

            topic.textContent = ele
            totlQuiz.textContent = Math.round(parseFloat(datae.quizTrendCardTotalQuiz[index]))
            averageMarks.textContent = Math.round(parseFloat(datae.quizTrendCardAvgMarks[index])) + "%"
            trendResult = ((datae.latestMarks[index] - (datae.quizTrendCardAvgMarks[index])) / (datae.quizTrendCardAvgMarks[index])) * 100
            console.log(trendResult,)
            if(trendResult < 0){
                
                trend.classList.add("trend-down")
                trend.textContent = '↓'+ Math.round(Math.abs(trendResult),2).toString()+"%"

            }else{

               
                 trend.classList.add("trend-up")
                  if(datae.quizTrendCardAvgMarks[index] == 0){
                 trend.textContent = '---'   
                }else{

                
                trend.textContent = '↑'+ Math.round(Math.abs(trendResult),2).toString()+"%"
            }
        }
        
            tr.appendChild(topic)
            tr.appendChild(totlQuiz)
            tr.appendChild(averageMarks)
            tr.appendChild(trend)
            quizTrendCard.appendChild(tr)

            // let totlQuiz = document.createElement("td")
        })

    }
      

        async function kpis(){
           let totalQuestion = 0
           let marks = 0
           let averageMarks = 0
           let totalTest = 0
            const response = await fetch("http://127.0.0.1:5000/quiz/fetchQuiz/HistoryQuiz/",{
                method:"GET",
                headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
            })
            const response2 = await fetch("http://127.0.0.1:5000/quiz/fetchQuiz/storedQuiz",{
             headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
        })
            const data = await response.json()
            const data2 = await response2.json()
            
            data.forEach(test => {
                totalQuestion = totalQuestion + parseInt(test.totlQuestions)
                marks = marks + parseInt(test.marks)
            });
            totalTest = (data.length) + (data2.length)

            if(totalQuestion == 0){
                averageMarks = 0
            }else{
                 averageMarks = (marks/totalQuestion) * 100

            }
            
            document.getElementById("totalQuizzesCompleted").textContent = data.length
            document.getElementById("totalQuizzes").textContent = (totalTest)
            document.getElementById("totalQuestion").textContent = totalQuestion
            document.getElementById("averageMarks").textContent = Math.round(averageMarks) + '%'

        }
        kpis()
        async function logout(){
    const response = await fetch(`http://127.0.0.1:5000/logout/`,{
            method:"GET",
            Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
            headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
        })
    const res = await response.json()
    if(res.status == 200){
        sessionStorage.clear()
        window.location.href = "http://127.0.0.1:5000/register/user.html"
    }    
}

document.addEventListener("DOMContentLoaded",()=>{
    displayGraphs(1)
})