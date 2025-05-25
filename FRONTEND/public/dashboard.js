        document.addEventListener("DOMContentLoaded",()=>{
        setTkn()
    })
    function setTkn(){
        if(sessionStorage.getItem("jwt") != document.cookie.split('=')[1]){
            console.log("changed",document.cookie.split('=')[1])
            sessionStorage.setItem("jwt",document.cookie.split('=')[1]) 
        }
    }
    

        // Monthly Activity Chart
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
                labels: ['JavaScript', 'Java','React', 'Other'],
                datasets: [{
                    data: [30, 20, 5, 5],
                    backgroundColor: ['#2dd4bf', '#34d399', '#facc15', '#a78bfa']
                }]
            },
            options: {
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });

        // Difficulty Distribution Chart
        const difficultyDistributionCtx = document.getElementById('difficultyDistributionChart').getContext('2d');
        new Chart(difficultyDistributionCtx, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard', 'Expert'],
                datasets: [{
                    data: [40, 30, 20, 10],
                    backgroundColor: ['#34d399', '#facc15', '#f87171', '#a78bfa']
                }]
            },
            options: {
                cutout: '70%',
                plugins: { legend: { display: false } }
            }
        });


      

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
            averageMarks = (marks/totalQuestion) * 100
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