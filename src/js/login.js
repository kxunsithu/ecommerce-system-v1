import { loginUser, getCurrentUser } from './auth.js';

// If already logged in, redirect to home
if (getCurrentUser()) {
  window.location.href = './home.html';
}

const form = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const rememberInput = document.getElementById('remember');
const loginBtn = document.getElementById('login-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertBox = document.getElementById('alert-box');
const forgotLink = document.getElementById('forgot-link');

// Check URL query params for post-registration message
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('registered') === 'true') {
  showAlert('Account created successfully! Please enter your credentials to login.', 'success');
}

// Password Visibility Toggle
const togglePasswordBtn = document.getElementById('toggle-password');
togglePasswordBtn?.addEventListener('click', () => {
  const isPassword = passwordInput.type === 'password';
  passwordInput.type = isPassword ? 'text' : 'password';

  togglePasswordBtn.innerHTML = isPassword
    ? `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
      </svg>`
    : `<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
      </svg>`;
});

// Forgot Password helper
forgotLink?.addEventListener('click', (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  if (email) {
    showAlert(`A password reset link would be sent to ${email} (Demo mode).`, 'info');
  } else {
    showAlert('Please enter your email address in the field above to reset your password.', 'info');
  }
});

// Helper to set specific field error
function setFieldError(fieldId, errorId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(errorId);
  if (!field || !error) return;

  if (message) {
    error.textContent = message;
    error.classList.remove('hidden');
    field.classList.add('border-red-500', 'focus:ring-red-400');
    field.classList.remove('border-gray-300', 'focus:ring-blue-500');
  } else {
    error.textContent = '';
    error.classList.add('hidden');
    field.classList.remove('border-red-500', 'focus:ring-red-400');
    field.classList.add('border-gray-300', 'focus:ring-blue-500');
  }
}

// Show alert message
function showAlert(message, type = 'error') {
  if (!alertBox) return;
  if (!message) {
    alertBox.classList.add('hidden');
    alertBox.textContent = '';
    return;
  }

  alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200', 'bg-green-50', 'text-green-700', 'border-green-200', 'bg-blue-50', 'text-blue-700', 'border-blue-200');

  if (type === 'error') {
    alertBox.className = 'mb-6 p-4 rounded-xl text-sm border bg-red-50 text-red-700 border-red-200 flex items-center gap-2';
    alertBox.innerHTML = `
      <svg class="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
  } else if (type === 'success') {
    alertBox.className = 'mb-6 p-4 rounded-xl text-sm border bg-green-50 text-green-700 border-green-200 flex items-center gap-2';
    alertBox.innerHTML = `
      <svg class="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
  } else {
    alertBox.className = 'mb-6 p-4 rounded-xl text-sm border bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-2';
    alertBox.innerHTML = `
      <svg class="w-5 h-5 shrink-0 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
  }
}

// Form Submission
form.addEventListener('submit', (e) => {
  e.preventDefault();

  setFieldError('email', 'email-error', '');
  setFieldError('password', 'password-error', '');
  showAlert('', '');

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const remember = rememberInput ? rememberInput.checked : true;

  let isValid = true;

  if (!email) {
    setFieldError('email', 'email-error', 'Email address is required.');
    isValid = false;
  }

  if (!password) {
    setFieldError('password', 'password-error', 'Password is required.');
    isValid = false;
  }

  if (!isValid) return;

  // Set loading state
  loginBtn.disabled = true;
  btnText.textContent = 'Logging In...';
  btnSpinner.classList.remove('hidden');

  setTimeout(() => {
    const result = loginUser(email, password, remember);

    loginBtn.disabled = false;
    btnText.textContent = 'Login';
    btnSpinner.classList.add('hidden');

    if (!result.success) {
      showAlert(result.message, 'error');
      setFieldError('password', 'password-error', 'Check your password and try again.');
      return;
    }

    showAlert(`Welcome back, ${result.user.name}! Redirecting...`, 'success');

    setTimeout(() => {
      window.location.href = './home.html';
    }, 800);
  }, 400);
});

