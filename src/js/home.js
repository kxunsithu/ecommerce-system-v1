const categoryContainer = document.getElementById('category-container');
const productContainer = document.getElementById('product-container');

categoryContainer.innerHTML = 'Loading categories...';
productContainer.innerHTML = 'Loading products...';

async function loadProducts() {
    
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        const data = await response.json();

        renderHomePage(data);
    } catch (e) {
        console.error('Error fetching products:', e);
    }
}

function renderHomePage(products) {

  categoryContainer.innerHTML = '';
  productContainer.innerHTML = '';

    const categories = [...new Set(products.map((p) => p.category))].map((category) => ({
      name: category,
      count: products.filter((p) => p.category === category).length,
    }));

    categories.forEach((category) => {
      
      categoryContainer.innerHTML += 
            ` <a
                href="#beauty"
                class="group flex items-center justify-center
                      rounded-2xl border border-gray-200 bg-gray-50 p-6
                      transition-all duration-300
                      hover:-translate-y-1 hover:border-gray-300
                      hover:bg-white hover:shadow-lg"
              >
                <h2
                  class="text-center text-lg font-semibold capitalize
                        text-gray-800 transition-colors duration-300
                        group-hover:text-black"
                >
                  ${category.name}
                </h2>
              </a>`;
    });

    products.forEach((p) => {
        productContainer.innerHTML += 
            `
             <div class="group flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
                <!-- Image & Badge Container -->
                <div class="relative bg-gradient-to-b from-gray-50/70 to-white p-6 h-56 sm:h-60 flex items-center justify-center overflow-hidden">
                  <!-- Category Badge -->
                  <span class="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-600 text-[11px] font-medium px-2.5 py-1 rounded-full shadow-xs border border-gray-100 capitalize tracking-wide">
                    ${p.category}
                  </span>
                  
                  <!-- Wishlist Button -->
                  <button type="button" class="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs shadow-xs border border-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-white transition-all cursor-pointer" aria-label="Add to wishlist">
                    <svg class="w-4 h-4 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>

                  <img src="${p.image}" alt="${p.title}"
                    class="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-xs"
                    loading="lazy"
                  />
                </div>

                <!-- Product Details -->
                <div class="p-5 flex flex-col flex-1 border-t border-gray-50">
      
                  <!-- Title -->
                  <h3 class="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 min-h-[2.5rem] leading-snug mb-3" title="${p.title}">
                    ${p.title}
                  </h3>

                  <!-- Bottom: Price & Button -->
                  <div class="mt-auto pt-3 border-t border-gray-100">
                    <div class="flex items-baseline justify-between mb-3">
                      <div>
                        <span class="text-[11px] font-medium text-gray-400 uppercase tracking-wider block">Price</span>
                        <span class="text-xl font-bold text-gray-900">$${p.price.toFixed(2)}</span>
                      </div>
                    </div>

                    <button type="button" class="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                      </svg>
                      Add To Cart
                    </button>
                  </div>
                </div>
            </div>

            `;
    });
}
    
loadProducts();

// Check if user is logged in

const isLoggedIn = localStorage.getItem('isLoggedIn');
const userData = JSON.parse(localStorage.getItem('userData'));
const deskAuthContainer = document.getElementById('desk-auth-container');

if (isLoggedIn === 'true') {
  const displayName = userData?.name || 'Account';
  const userInitial = displayName.trim().charAt(0).toUpperCase();

  deskAuthContainer.innerHTML = `
    <div class="flex items-center gap-3">
      <button type="button" aria-label="Wishlist"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200
               bg-white text-gray-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 relative">

        <span id="wishlist-count" class="w-6 h-6 bg-red-500 text-white absolute -top-1 -right-2 rounded-full">3</span>

        <svg class="h-5 w-5 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
        </svg>
      </button>

      <button type="button" aria-label="Shopping cart"
        class="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200
               bg-white text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 relative">
      
       <span id="wishlist-count" class="w-6 h-6 bg-red-500 text-white absolute -top-1 -right-2 rounded-full">3</span>

        <svg class="h-5 w-5 fill-none stroke-current" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
      </button>

      <div class="flex items-center gap-2.5 border-l border-gray-200 pl-4">
        <span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100
                     text-sm font-semibold text-blue-700">${userInitial}</span>
        <span class="max-w-32 truncate text-sm font-medium text-gray-700">${displayName}</span>
      </div>

      <button id="logout-btn" type="button"
        class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition
               hover:bg-gray-100 hover:text-gray-900">
        Logout
      </button>
    </div>
  `;
}

const logoutBtn = document.getElementById('logout-btn');

logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('isLoggedIn');

    window.location.href = './login.html';
  })


