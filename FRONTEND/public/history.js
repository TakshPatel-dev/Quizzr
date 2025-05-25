     async  function loadHistoryQuizzes() {
            const quizGrid = document.getElementById('quizGrid');
            quizGrid.innerHTML = '';
            const response = await fetch("http://127.0.0.1:5000/quiz/fetchQuiz/HistoryQuiz/",{
                method:"GET",
                headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
            })
            const data = await response.json()

            data.forEach((quiz, index) => {
                const quizCard = document.createElement('div');
                quizCard.className = 'quiz-card';
                quizCard.setAttribute('data-index', index);
                quizCard.innerHTML = `
                    <h3>${quiz.topic}</h3>
                    <span class="difficulty ${quiz.difficulty}">${quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}</span>
                    <p>testId: ${quiz.quizId}</p>
                    <div class="stats">
                        <span>${quiz.totlQuestions} Questions</span>
                    </div>
                    <p>${quiz.completedAt}</p>
                    <button>View Analysis</button>

                `;
                quizCard.onclick = () => showAnalysis(quiz.quizId);
                quizGrid.appendChild(quizCard);
            });
        }

        function searchQuizzes() {
            const searchInput = document.getElementById('searchInput').value.toLowerCase();
            const filterDifficulty = document.getElementById('filterDifficulty').value;
            const quizCards = document.querySelectorAll('.quiz-card');

            quizCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                const difficulty = card.querySelector('.difficulty').classList[1];

                const matchesSearch = title.includes(searchInput) || description.includes(searchInput);
                const matchesDifficulty = filterDifficulty === 'all' || difficulty === filterDifficulty;

                if (matchesSearch && matchesDifficulty) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        function showAnalysis(quizId) {
            sessionStorage.setItem("quizId",quizId)
            window.location.href = "http://127.0.0.1:5000/quizQuest/historyAnalysis.html/"
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

        // Initial load
        document.addEventListener('DOMContentLoaded', () => {
            setTkn()
            loadHistoryQuizzes();
            searchQuizzes();
        });
    function setTkn(){
        if(sessionStorage.getItem("jwt") != document.cookie.split('=')[1]){
            console.log("changed",document.cookie.split('=')[1])
            sessionStorage.setItem("jwt",document.cookie.split('=')[1]) 
        }
    }