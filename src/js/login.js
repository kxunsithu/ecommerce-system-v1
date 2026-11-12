const email = document.getElementById('email');
const password = document.getElementById('password');
const form = document.querySelector('form');

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const savedUser = JSON.parse(localStorage.getItem('userData') || 'null');

        if (!savedUser) {
            alert('No registered user found. Please create an account first.');
            return;
        }

        if (savedUser.email !== email.value.trim()) {
            alert('Email is incorrect.');
            email.focus();
            return;
        }

        if (savedUser.password !== password.value) {
            alert('Password is incorrect.');
            password.focus();
            return;
        }

        localStorage.setItem('loggedInUser', JSON.stringify({
            name: savedUser.name,
            email: savedUser.email
        }));

        window.location.href = './home.html';
    });
}
