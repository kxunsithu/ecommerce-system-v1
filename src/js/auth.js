// Central Authentication Service for MyShop

const STORAGE_KEY_USERS = 'myshop_users';
const STORAGE_KEY_CURRENT_USER = 'myshop_current_user';
const LEGACY_STORAGE_KEY = 'userData';

/**
 * Get all registered users from localStorage.
 * Automatically migrates legacy 'userData' if present.
 */
export function getUsers() {
  let users = [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (raw) {
      users = JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse users from localStorage', err);
    users = [];
  }

  // Backwards compatibility migration for legacy single user
  try {
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyUser = JSON.parse(legacyRaw);
      if (legacyUser && legacyUser.email) {
        const exists = users.some((u) => u.email.toLowerCase() === legacyUser.email.toLowerCase());
        if (!exists) {
          users.push(legacyUser);
          localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
        }
      }
    }
  } catch (err) {
    console.error('Failed to migrate legacy userData', err);
  }

  return Array.isArray(users) ? users : [];
}

/**
 * Get the currently logged-in user.
 */
export function getCurrentUser() {
  try {
    // Check localStorage (Remember Me) then sessionStorage
    const local = localStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (local) return JSON.parse(local);

    const session = sessionStorage.getItem(STORAGE_KEY_CURRENT_USER);
    if (session) return JSON.parse(session);
  } catch (err) {
    console.error('Failed to get current user', err);
  }
  return null;
}

/**
 * Log in a user and set their session.
 */
export function loginUser(email, password, remember = true) {
  const users = getUsers();
  const cleanEmail = email.trim().toLowerCase();

  const user = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === password
  );

  if (!user) {
    return { success: false, message: 'Invalid email address or password.' };
  }

  const sessionUser = {
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    gender: user.gender || '',
    loginTime: new Date().toISOString(),
  };

  if (remember) {
    localStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
  } else {
    sessionStorage.setItem(STORAGE_KEY_CURRENT_USER, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

/**
 * Register a new user.
 */
export function registerUser(newUser) {
  const users = getUsers();
  const cleanEmail = newUser.email.trim().toLowerCase();

  const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
  if (exists) {
    return { success: false, message: 'An account with this email address already exists.' };
  }

  const userRecord = {
    name: newUser.name.trim(),
    email: cleanEmail,
    phone: newUser.phone ? newUser.phone.trim() : '',
    gender: newUser.gender || '',
    password: newUser.password,
    registeredAt: new Date().toISOString(),
  };

  users.push(userRecord);
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));

  // Maintain backwards compatibility
  localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(userRecord));

  return { success: true, user: userRecord };
}

/**
 * Log out the current user.
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  sessionStorage.removeItem(STORAGE_KEY_CURRENT_USER);
  window.location.reload();
}

/**
 * Initialize navbar auth state on any page.
 */
export function initNavbarAuth() {
  const user = getCurrentUser();
  const desktopContainer = document.getElementById('auth-buttons-desktop');
  const mobileContainer = document.getElementById('auth-buttons-mobile');

  if (user) {
    const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
    const firstName = user.name ? user.name.split(' ')[0] : 'User';

    if (desktopContainer) {
      desktopContainer.innerHTML = `
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 py-1.5 px-3 bg-gray-50 border border-gray-200 rounded-full text-sm font-medium text-gray-800 shadow-2xs">
            <div class="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
              ${initial}
            </div>
            <span class="max-w-[120px] truncate">${firstName}</span>
          </div>
          <button id="logout-btn" type="button" class="px-3.5 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 hover:border-red-300 transition cursor-pointer">
            Logout
          </button>
        </div>
      `;
    }

    if (mobileContainer) {
      mobileContainer.innerHTML = `
        <div class="flex flex-col space-y-3">
          <div class="flex items-center gap-3 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800">
            <div class="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm flex items-center justify-center">
              ${initial}
            </div>
            <div class="overflow-hidden">
              <p class="font-semibold text-gray-900 truncate">${user.name}</p>
              <p class="text-xs text-gray-500 truncate">${user.email}</p>
            </div>
          </div>
          <button id="mobile-logout-btn" type="button" class="w-full text-center px-4 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition cursor-pointer">
            Logout
          </button>
        </div>
      `;
    }

    document.getElementById('logout-btn')?.addEventListener('click', logoutUser);
    document.getElementById('mobile-logout-btn')?.addEventListener('click', logoutUser);
  }
}

