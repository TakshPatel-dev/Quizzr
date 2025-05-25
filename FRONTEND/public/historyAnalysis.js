        async function getAnalysis(){
                const response =await  fetch("http://127.0.0.1:5000/quiz/fetchQuiz/getAnalysis/",{
                method:"POST",
                body:JSON.stringify({quizId:sessionStorage.getItem("quizId")}),
                headers:{"Content-Type":"Application/Json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
            })
        const quizData = await response.json()
        document.getElementById("title").innerText = quizData.quizMetaData.topic + ' Quiz Analysis'
        // Simulated user answers (replace with actual user data if available)
        const userAnswers = quizData.answer

        // Generate analysis content
        const analysisContent = document.getElementById('analysisContent');
        const questions = Object.values(quizData).filter(item => item.id);
        let correctCount = 0;

        questions.forEach((question, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'question';

            const questionText = document.createElement('p');
            questionText.innerHTML = `<strong>Question ${index + 1}:</strong> ${question.question}`;
            questionDiv.appendChild(questionText);

            const optionsDiv = document.createElement('div');
            optionsDiv.className = 'options';

            const correctAnswerKey = Object.keys(question.correct_answers).find(key => question.correct_answers[key] === "true").replace('_correct', '');
            const userAnswer = userAnswers[index];

            Object.entries(question.answers).forEach(([key, value]) => {
                if (value !== null) {
                    const label = document.createElement('label');
                    if (key === correctAnswerKey) {
                        label.className = 'correct';
                    }
                    if (userAnswer === key) {
                        label.classList.add('selected');
                        if (key === correctAnswerKey) correctCount++;
                    }
                    label.textContent = value;
                    optionsDiv.appendChild(label);
                }
            });

            questionDiv.appendChild(optionsDiv);

            const descriptionDiv = document.createElement('div');
            descriptionDiv.className = 'description';
            descriptionDiv.innerHTML = `<p><strong>Description:</strong> ${question.description}</p>`;
            questionDiv.appendChild(descriptionDiv);

            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation';
            explanationDiv.innerHTML = `<p><strong>Explanation:</strong> ${question.explanation}</p>`;
            questionDiv.appendChild(explanationDiv);

            analysisContent.appendChild(questionDiv);
        });

        // Update marks
        const totalQuestions = questions.length;
        const percentage = ((correctCount / totalQuestions) * 100).toFixed(2);
        document.getElementById('marksValue').textContent = `${percentage}% (${correctCount}/${totalQuestions})`;
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

    getAnalysis()