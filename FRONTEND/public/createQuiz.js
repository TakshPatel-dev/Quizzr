       async function createQuiz(event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const language = document.getElementById('language').value;
            const difficulty = document.getElementById('difficulty').value;
            const questions = document.getElementById('questions').value;
            const timeLimit = document.getElementById('timeLimit').value;

            if (title && description && language && difficulty && questions && timeLimit) {
                // alert(`Quiz Created!\nTitle: ${title}\nDescription: ${description}\nLanguage: ${language}\nDifficulty: ${difficulty.toLowerCase()}\nQuestions: ${questions}\nTime Limit: ${timeLimit} minutes`);
                        const loader = document.getElementById("loader")
                        loader.style.display = "flex"
                const response = await fetch(`http://127.0.0.1:5000/quiz/fetchQuiz/${language.toLowerCase()}/${difficulty}/${questions}/${description}/${timeLimit}/${title}`,{
                    method:"GET",
                    Authorization: `Bearer ${sessionStorage.getItem('jwt')}`,
                    headers:{"Content-Type":"Application/json","Authorization":`Bearer ${sessionStorage.getItem('jwt')}`}
                })
                const data = await response.json()
                loader.style.display = "none"

                alert('status: '+data.status +'\n'+ 'message: '+data.message)
                document.getElementById('quizForm').reset();
            } else {
                alert('Please fill in all fields.');
            }
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
