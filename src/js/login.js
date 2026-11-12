const email = document.getElementById('email');
const password = document.getElementById('password');
const loginBtn = document.getElementById('login-btn');

const userData = JSON.parse(localStorage.getItem('userData')); 

loginBtn.addEventListener('click', () => {

    if(email.value !== userData.email) {
        alert('Email does not match our records.');
        return;
    }

    if(password.value !== userData.password) {
        alert('Password does not match our records.');
        return;
    }

    localStorage.setItem('isLoggedIn', 'true');

    // Redirect to home page after successful login
    window.location.href = './home.html';

})
    