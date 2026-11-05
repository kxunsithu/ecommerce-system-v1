import { products } from './products.js';


const categories = [...new Set(products.map((p) => p.category))].map((category) => ({
  name: category,
  count: products.filter((p) => p.category === category).length,
}));


const categoryContainer = document.getElementById('category-container');

categories.forEach((category) => {
  
  categoryContainer.innerHTML += 
        ` <a
            href="#beauty"
            class="group flex aspect-square items-center justify-center
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

const productContainer = document.getElementById('product-container');

products.forEach((p) => {
    productContainer.innerHTML += 
        ` <div class="bg-white rounded-2xl shadow-md overflow-hidden
                      transition-all duration-300 hover:shadow-lg"
            >
              <img src="${p.image}" alt="${p.title}"
                class="w-full h-48 object-cover"
              />
              <div class="p-4">
                <h4 class="text-sm text-gray-500">
                  ${p.category}
                </h4>
                <h3 class="text-lg font-semibold text-gray-900">
                  ${p.title}
                </h3>
                <p class="text-xl font-bold text-blue-600 mt-3">
                  $${p.price.toFixed(2)}
                </p>
              </div>
            </div>`;
});