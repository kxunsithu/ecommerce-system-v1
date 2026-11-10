const name = document.getElementById('name');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const gender = document.getElementById('gender');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirm_password');

const createBtn = document.getElementById('create-btn');

createBtn.addEventListener('click',  () => {
    const userData = {
        name: name.value,
        email: email.value,
        phone: phone.value,
        gender: gender.value,
        password: password.value,
        confirmPassword: confirmPassword.value
    };

    localStorage.setItem('userData', JSON.stringify(userData));

    // Redirect to login page after registration
    window.location.href = './login.html';

});
