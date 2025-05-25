  let quiz = null; // Single quiz object
    let timeLeft = 0;
    let timerInterval = null;
    let score = 0; // Track the user's score

    // Fetch quiz from the provided JSON data

        
    async  function loadStoredQuizzes() {
            
            const storedQuizzesDiv = document.getElementById('storedQuizzes');
        
            const response = await fetch("http://127.0.0.1:5000/quiz/fetchQuiz/storedQuiz",{
             headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
        })
        const data = await response.json()
            data.forEach((quiz, index) => {
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                quizCard.setAttribute('data-index', index);
                quizCard.innerHTML = `
                    <h3>${quiz.title}</h3>
                    <p>${quiz.description}</p>
                    <p>Language: ${quiz.topic} | Difficulty: <span class="difficulty ${quiz.difficulty}">${quiz.difficulty}</span> | Time: ${quiz.time} min</p>
                    <button class="start-btn" onclick="startQuiz(${quiz.quizId})">Start</button>
                `;
                storedQuizzesDiv.appendChild(quizCard);
            });
        }
        loadStoredQuizzes();

    function startQuiz(id) {
        sessionStorage.setItem("testId",id)
        window.location.href = "http://127.0.0.1:5000/quizQuest/Questions.html"

    }
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
        setTkn()
    })
     function setTkn(){
        if(sessionStorage.getItem("jwt") != document.cookie.split('=')[1]){
            console.log("changed",document.cookie.split('=')[1])
            sessionStorage.setItem("jwt",document.cookie.split('=')[1]) 
        }
    }
