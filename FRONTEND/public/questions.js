  let quiz = null;
    let timeLeft = 0;
    let timerInterval = null;
    let score = 0;

function checkFocus() {

  if ( document.hasFocus() ) {
    return
  } else {
    submitQuiz("changed Tabs")
  }
}

document.addEventListener("visibilitychange", (event) => {
  if (document.visibilityState == "visible") {
    console.log("Tab is active");
    // Implement your logic for when the tab becomes visible
  } else {
    submitQuiz("tab Changed")
  }
});
window.addEventListener("beforeunload", () => {
    submitQuiz("back/forward movement")
});
document.addEventListener("blur",()=>{
    submitQuiz("Clicked Outside of the QuizPanel")
})
function isIOS() {
    return /iPhone|iPad|iPod/.test(navigator.userAgent);
}
function isSplitScreen() {
    return window.innerWidth < screen.availWidth * 0.8 || window.innerHeight < screen.availHeight * 0.8;
}

function checkSplitScreenBeforeLogin() {
    if (isSplitScreen()) {
        alert('Split-screen mode detected. Please exit split-screen to proceed.');
        window.location.href = '/quizQuest/Dashboard.html';
    }
    return true;
}
window.addEventListener('popstate', () => {
    submitQuiz("back/forward Navigation");
});


window.addEventListener("beforeunload",()=>{
    onbeforeunload = ()=>{
        submitQuiz("back/forth navigation")
    }
})
    // Load quiz from JSON data
    async function loadQuiz() {
        try {
            
            response = await fetch(`http://127.0.0.1:5000/quiz/fetchQuiz/startQuiz/${sessionStorage.getItem("testId")}`,{
                headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem("jwt")}`}
            })
            data = await response.json()
            quiz = Object.values(data).filter(item => item.id); // Extract questions from JSON
            startQuiz(data.quizMetaData.time,data.quizMetaData.topic);
        } catch (error) {
            console.error('Error loading quiz:', error);
            document.getElementById('questionsContainer').innerHTML = '<p>Error loading quiz. Please try again later.</p>';
        }
    }

    function startQuiz(time,title) {
        score = 0; // Reset the score
        timeLeft = time * 60 ; // Use time from quizMetaData (30 minutes)
        document.getElementById('quizTitle').textContent = title;
        document.getElementById('timer').textContent = formatTime(timeLeft);
        clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
        loadQuestions();
        document.getElementById('quizContainer').classList.add('active');
        document.getElementById('scorePage').classList.remove('active');
    }

    function loadQuestions() {
        const questionsContainer = document.getElementById('questionsContainer');
        questionsContainer.innerHTML = quiz.map((question, index) => `
            <div class="question-block unselectable">
                <p class="question">${index + 1}. ${question.question}</p>
                <div class="options">
                    ${Object.keys(question.answers)
                        .filter(key => question.answers[key]) // Only include non-null answers
                        .map(key => `
                            <label>
                                <input type="radio" name="question${index}" value="${key}">
                                ${question.answers[key]}
                            </label>
                        `).join('')}
                </div>
            </div>
        `).join('');
    }

    function updateTimer() {
        timeLeft--;
        document.getElementById('timer').textContent = formatTime(timeLeft);
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            submitQuiz();
        }
        
        checkSplitScreenBeforeLogin()
        checkFocus()
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

   async function submitQuiz(violation) {
        clearInterval(timerInterval);
        score = 0; // Reset score
        answerStored = {}
        quiz.forEach((question, index) => {
            const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
            const correctAnswers = question.correct_answers;
            if (selectedOption) {
                answerStored[index.toString()] = selectedOption.value

                const selectedKey = selectedOption.value;
                if (correctAnswers[selectedKey + '_correct'] === 'true') {
                    score++; // Increment score for a correct answer
                }
            }
        });

        // Show score page
        document.getElementById('quizContainer').classList.remove('active');
        document.getElementById('scorePage').classList.add('active');
        const percentage = ((score / quiz.length) * 100).toFixed(2);
        document.getElementById('scoreResult').textContent = `You scored ${score} out of ${quiz.length} (${percentage}%)`;
        response = await fetch("http://127.0.0.1:5000/quiz/fetchQuiz/completedQuiz/",{
            method:'POST',
            headers:{
                "Content-Type":"Application/json",
                "Authorization":`Bearer ${sessionStorage.getItem("jwt")}`
            },
            body:JSON.stringify({quizId:sessionStorage.getItem("testId"),marks:score.toString(),answers:answerStored})
        })
        if(response.ok){
            alert("DONE")
        }
    }

    function restartQuiz() {
        sessionStorage.setItem("testId","")
        window.location.href = "http://127.0.0.1:5000/quizQuest/History.html"
    }

    loadQuiz();
    document.addEventListener("DOMContentLoaded",()=>{
        setTkn()
    })
     function setTkn(){
        if(sessionStorage.getItem("jwt") != document.cookie.split('=')[1]){
            console.log("changed",document.cookie.split('=')[1])
            sessionStorage.setItem("jwt",document.cookie.split('=')[1]) 
        }
    }

document.addEventListener("click", function() {
    var docElm = document.documentElement;
    if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
    } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
    } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
    } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
    }

        
});
let fullscreenChangedValue = 0;
 document.addEventListener("fullscreenchange", function () {
        fullscreenChangedValue +=1
        if(fullscreenChangedValue > 1){
                    submitQuiz("fullscreen exited")

        }
}, false);

document.addEventListener("mozfullscreenchange", function () {
            fullscreenChangedValue +=1

              if(fullscreenChangedValue > 1){
                    submitQuiz("fullscreen exited")

        }
}, false);

document.addEventListener("webkitfullscreenchange", function () {
            fullscreenChangedValue +=1

        if(fullscreenChangedValue > 1){
                    submitQuiz("fullscreen exited")

        }}, false);

document.addEventListener("msfullscreenchange", function () {
            fullscreenChangedValue +=1

        if(fullscreenChangedValue > 1){
                    submitQuiz("fullscreen exited")

        }}, false);
console.log(fullscreenChangedValue)

window.onbeforeunload = ()=>{
    submitQuiz("UNLOAD")
}