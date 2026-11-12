import { initNavbarAuth } from './auth.js';

initNavbarAuth();

const productsGrid = document.getElementById('products-grid');
const productCount = document.getElementById('product-count');
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const categoryPills = document.getElementById('category-pills');
const sortSelect = document.getElementById('sort-select');

let allProducts = [];
let selectedCategory = 'all';
let searchQuery = '';
let currentSort = 'default';

function renderRatingStars(rating) {
  const roundedStars = Math.min(5, Math.max(0, Math.round(rating)));
  let starsHtml = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= roundedStars) {
      starsHtml += `<svg class="w-3.5 h-3.5 fill-amber-400 text-amber-400" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>`;
    } else {
      starsHtml += `<svg class="w-3.5 h-3.5 fill-gray-200 text-gray-200" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>`;
    }
  }
  return starsHtml;
}

function createProductCard(p) {
  const rating = p.rating ? p.rating.rate : 4.5;
  const reviewCount = p.rating ? p.rating.count : 0;

  return `
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
        <!-- Ratings -->
        <div class="flex items-center gap-2 mb-2.5">
          <div class="flex items-center gap-0.5" title="${rating} out of 5 stars">
            ${renderRatingStars(rating)}
          </div>
          <span class="text-xs font-semibold text-gray-800">${rating}</span>
          <span class="text-xs text-gray-400">(${reviewCount})</span>
        </div>

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
}

function setupCategories(products) {
  const categories = ['all', ...new Set(products.map((p) => p.category))];

  // Populate Select Dropdown
  categoryFilter.innerHTML = categories
    .map(
      (cat) => `<option value="${cat}">${cat === 'all' ? 'All Categories' : cat}</option>`
    )
    .join('');

  // Populate Quick Filter Pills
  categoryPills.innerHTML = categories
    .map((cat) => {
      const isActive = cat === selectedCategory;
      const count =
        cat === 'all'
          ? products.length
          : products.filter((p) => p.category === cat).length;

      return `
        <button
          type="button"
          data-category="${cat}"
          class="category-pill text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition cursor-pointer ${
            isActive
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }"
        >
          ${cat === 'all' ? 'All' : cat} (${count})
        </button>
      `;
    })
    .join('');

  // Add click listeners to pills
  document.querySelectorAll('.category-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectedCategory = btn.getAttribute('data-category');
      categoryFilter.value = selectedCategory;
      updatePills();
      renderFilteredProducts();
    });
  });
}

function updatePills() {
  document.querySelectorAll('.category-pill').forEach((btn) => {
    const cat = btn.getAttribute('data-category');
    if (cat === selectedCategory) {
      btn.className =
        'category-pill text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition cursor-pointer bg-blue-600 text-white shadow-xs';
    } else {
      btn.className =
        'category-pill text-xs font-medium px-3.5 py-1.5 rounded-full capitalize transition cursor-pointer bg-gray-100 text-gray-700 hover:bg-gray-200';
    }
  });
}

function renderFilteredProducts() {
  let filtered = allProducts.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  // Apply sorting
  if (currentSort === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (currentSort === 'rating-desc') {
    filtered.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
  } else if (currentSort === 'title-asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title));
  }

  // Update product count label
  if (productCount) {
    productCount.textContent = `Showing ${filtered.length} of ${allProducts.length} products`;
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-span-full py-16 text-center">
        <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
        <p class="text-sm text-gray-500 max-w-sm mx-auto mb-6">
          We couldn't find any products matching your search or filters. Try adjusting your query.
        </p>
        <button id="reset-filter-btn" type="button" class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition">
          Reset Filters
        </button>
      </div>
    `;

    document.getElementById('reset-filter-btn')?.addEventListener('click', () => {
      selectedCategory = 'all';
      searchQuery = '';
      currentSort = 'default';
      searchInput.value = '';
      categoryFilter.value = 'all';
      sortSelect.value = 'default';
      updatePills();
      renderFilteredProducts();
    });
    return;
  }

  // Render all filtered products
  productsGrid.innerHTML = filtered.map(createProductCard).join('');
}

async function loadProducts() {
  try {
    const response = await fetch('https://fakestoreapi.com/products');
    allProducts = await response.json();

    setupCategories(allProducts);
    renderFilteredProducts();
  } catch (error) {
    console.error('Error fetching products:', error);
    productsGrid.innerHTML = `
      <div class="col-span-full py-12 text-center text-red-500 text-sm">
        Failed to load products. Please check your network connection and try again.
      </div>
    `;
    if (productCount) productCount.textContent = 'Failed to load products';
  }
}

// Event Listeners
searchInput?.addEventListener('input', (e) => {
  searchQuery = e.target.value.trim().toLowerCase();
  renderFilteredProducts();
});

categoryFilter?.addEventListener('change', (e) => {
  selectedCategory = e.target.value;
  updatePills();
  renderFilteredProducts();
});

sortSelect?.addEventListener('change', (e) => {
  currentSort = e.target.value;
  renderFilteredProducts();
});

loadProducts();

