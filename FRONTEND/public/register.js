

function toggleForm(formId) {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.add('hidden');
    
    document.getElementById(formId).classList.remove('hidden');
      }
  
async function handleLogin(event) {
    event.preventDefault();
    
    const usrName = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked
    if (!usrName || !password) {
      showNotification('Please fill in all fields', 'error');
      return false;
    }
    const button = event.target.querySelector('.btnPrimary');
   
     const loader = document.getElementById("loader")
    loader.style.display = "block"
    button.disabled = true;
    const x = await fetch("http://127.0.0.1:5000/login/user",{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({usrName:usrName,password:password,rememberMe})
    })
    response = await x.json()
    if(!response){showNotification("INTERNAL SERVER ERROR","error")}
    if(response.status == "404"){showNotification("User not found","error")}
    if(response.status == "401"){showNotification("Incorrect Password or Username","error")}

       
    loader.style.display = "none"
    button.disabled = false;
    sessionStorage.setItem("jwt",response.jwt)
    if(response.status == "200"){showNotification("Login Successfull","success")
      window.location.href = "http://127.0.0.1:5000/quizQuest/Dashboard.html"

    }


  }
  
  async function handleRegister(event) {
    event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    clearErrors();
    
    let hasError = false;
    
    if (!email) {
      showInputError('registerEmail', 'Email is required');
      hasError = true;
    } else {
     
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showInputError('registerEmail', 'Please enter a valid email address');
        hasError = true;
      }
    }
    
    if (!username) {
      showInputError('registerUsername', 'Username is required');
      hasError = true;
    } else if (username.length < 3) {
      showInputError('registerUsername', 'Username must be at least 3 characters');
      hasError = true;
    }
    
    if (!password) {
      showInputError('registerPassword', 'Password is required');
      hasError = true;
    } else if (password.length < 6) {
      showInputError('registerPassword', 'Password must be at least 6 characters');
      hasError = true;
    }
    
    if (password !== confirmPassword) {
      showInputError('confirmPassword', 'Passwords do not match');
      hasError = true;
    }
    
    if (hasError) {
      return false;
    }
        
        const button = event.target.querySelector('.btnPrimary');
        const loader = document.getElementById("loader")
        loader.style.display = "flex"
        button.disabled = true;
   x = await fetch("http://127.0.0.1:5000/register/reg",{
    method:"POST",
    body:JSON.stringify({usrName : username,password:password,email:email}),
    headers:{"Content-Type":"application/json"}
   })

   response = await x.json()
   if(response.status == "200"){
    showNotification('Registration successful! You can now login.', 'success');
    toggleForm('loginForm')
   }if(response.status === "409"){
    showNotification("The username already exist! ",'error')
   }
   loader.style.display = "none"


  }
  
  // Function to clear all error messages
  function clearErrors() {
  
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(element => element.remove());
  }
  

  function showInputError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    
    
    inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
  }
  


  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 500);
    }, 3000);
  }
  

  document.addEventListener('DOMContentLoaded', function() {
    toggleForm('registerForm');
    
    document.querySelectorAll('.formFooter a').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        if (this.textContent.includes('Log in')) {
          toggleForm('loginForm');
        } else if (this.textContent.includes('Create account')) {
          toggleForm('registerForm');
        }
      });
    });
  });

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

