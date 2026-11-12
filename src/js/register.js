import { registerUser, getCurrentUser } from './auth.js';

// If already logged in, redirect to home
if (getCurrentUser()) {
  window.location.href = './home.html';
}

const form = document.getElementById('register-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const genderInput = document.getElementById('gender');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm_password');
const termsInput = document.getElementById('terms');
const createBtn = document.getElementById('create-btn');
const btnText = document.getElementById('btn-text');
const btnSpinner = document.getElementById('btn-spinner');
const alertBox = document.getElementById('alert-box');

// Password Visibility Toggles
function setupPasswordToggle(buttonId, inputId) {
  const btn = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!btn || !input) return;

  btn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';

    btn.innerHTML = isPassword
      ? `<svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"/>
        </svg>`
      : `<svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>`;
  });
}

setupPasswordToggle('toggle-password', 'password');
setupPasswordToggle('toggle-confirm-password', 'confirm_password');

// Helper to display error message under specific field
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

// Clear all field errors
function clearAllErrors() {
  setFieldError('name', 'name-error', '');
  setFieldError('email', 'email-error', '');
  setFieldError('phone', 'phone-error', '');
  setFieldError('gender', 'gender-error', '');
  setFieldError('password', 'password-error', '');
  setFieldError('confirm_password', 'confirm-password-error', '');
  setFieldError('terms', 'terms-error', '');
  showAlert('', '');
}

// Show alert banner
function showAlert(message, type = 'error') {
  if (!alertBox) return;
  if (!message) {
    alertBox.classList.add('hidden');
    alertBox.textContent = '';
    return;
  }

  alertBox.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'border-red-200', 'bg-green-50', 'text-green-700', 'border-green-200');

  if (type === 'error') {
    alertBox.className = 'mb-6 p-4 rounded-xl text-sm border bg-red-50 text-red-700 border-red-200 flex items-center gap-2';
    alertBox.innerHTML = `
      <svg class="w-5 h-5 shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
  } else {
    alertBox.className = 'mb-6 p-4 rounded-xl text-sm border bg-green-50 text-green-700 border-green-200 flex items-center gap-2';
    alertBox.innerHTML = `
      <svg class="w-5 h-5 shrink-0 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>${message}</span>
    `;
  }
}

// Validation logic
function validateForm() {
  clearAllErrors();
  let isValid = true;

  // Name
  const nameVal = nameInput.value.trim();
  if (!nameVal) {
    setFieldError('name', 'name-error', 'Full name is required.');
    isValid = false;
  } else if (nameVal.length < 2) {
    setFieldError('name', 'name-error', 'Name must be at least 2 characters.');
    isValid = false;
  }

  // Email
  const emailVal = emailInput.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailVal) {
    setFieldError('email', 'email-error', 'Email address is required.');
    isValid = false;
  } else if (!emailRegex.test(emailVal)) {
    setFieldError('email', 'email-error', 'Please enter a valid email address.');
    isValid = false;
  }

  // Phone
  const phoneVal = phoneInput.value.trim();
  const phoneRegex = /^[\d\s+\-()]{7,15}$/;
  if (!phoneVal) {
    setFieldError('phone', 'phone-error', 'Phone number is required.');
    isValid = false;
  } else if (!phoneRegex.test(phoneVal)) {
    setFieldError('phone', 'phone-error', 'Please enter a valid phone number.');
    isValid = false;
  }

  // Gender
  if (!genderInput.value) {
    setFieldError('gender', 'gender-error', 'Please select your gender.');
    isValid = false;
  }

  // Password
  const passVal = passwordInput.value;
  if (!passVal) {
    setFieldError('password', 'password-error', 'Password is required.');
    isValid = false;
  } else if (passVal.length < 8) {
    setFieldError('password', 'password-error', 'Password must be at least 8 characters long.');
    isValid = false;
  }

  // Confirm Password
  const confirmVal = confirmPasswordInput.value;
  if (!confirmVal) {
    setFieldError('confirm_password', 'confirm-password-error', 'Please confirm your password.');
    isValid = false;
  } else if (confirmVal !== passVal) {
    setFieldError('confirm_password', 'confirm-password-error', 'Passwords do not match.');
    isValid = false;
  }

  // Terms
  if (!termsInput.checked) {
    setFieldError('terms', 'terms-error', 'You must agree to the Terms & Conditions.');
    isValid = false;
  }

  return isValid;
}

// Form submit handler
form.addEventListener('submit', (e) => {
  e.preventDefault();

  if (!validateForm()) {
    showAlert('Please fix the errors marked in red.');
    return;
  }

  // Set loading state
  createBtn.disabled = true;
  btnText.textContent = 'Creating Account...';
  btnSpinner.classList.remove('hidden');

  setTimeout(() => {
    const result = registerUser({
      name: nameInput.value,
      email: emailInput.value,
      phone: phoneInput.value,
      gender: genderInput.value,
      password: passwordInput.value,
    });

    createBtn.disabled = false;
    btnText.textContent = 'Create Account';
    btnSpinner.classList.add('hidden');

    if (!result.success) {
      showAlert(result.message, 'error');
      setFieldError('email', 'email-error', result.message);
      return;
    }

    // Success notification
    showAlert('Account created successfully! Redirecting to login...', 'success');
    form.reset();

    setTimeout(() => {
      window.location.href = './login.html?registered=true';
    }, 1200);
  }, 400);
});
