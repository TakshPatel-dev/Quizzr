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
            <button class="start-btn" onclick="selectAndStartQuiz(${index}, event)">Start</button>
        `;
        storedQuizzesDiv.appendChild(quizCard);
    });
}
