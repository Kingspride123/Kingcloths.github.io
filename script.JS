// Add to script.js

document.addEventListener('DOMContentLoaded', () => {
    // ... (previous code)

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function searchProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.category.toLowerCase().includes(searchTerm)
        );
        renderProducts(filteredProducts);
    }

    searchButton.addEventListener('click', searchProducts);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // User account system
    const accountBtn = document.getElementById('accountBtn');
    let currentUser = null;

    function showLoginForm() {
        const loginHtml = `
            <div id="loginForm">
                <h2>Login</h2>
                <input type="email" id="loginEmail" placeholder="Email" required>
                <input type="password" id="loginPassword" placeholder="Password" required>
                <button id="loginSubmit">Login</button>
                <p>Don't have an account? <a href="#" id="showRegister">Register</a></p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loginHtml);
        
        document.getElementById('loginSubmit').addEventListener('click', login);
        document.getElementById('showRegister').addEventListener('click', showRegisterForm);
    }

    function showRegisterForm() {
        const registerHtml = `
            <div id="registerForm">
                <h2>Register</h2>
                <input type="text" id="registerName" placeholder="Name" required>
                <input type="email" id="registerEmail" placeholder="Email" required>
                <input type="password" id="registerPassword" placeholder="Password" required>
                <button id="registerSubmit">Register</button>
                <p>Already have an account? <a href="#" id="showLogin">Login</a></p>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', registerHtml);
        
        document.getElementById('registerSubmit').addEventListener('click', register);
        document.getElementById('showLogin').addEventListener('click', showLoginForm);
    }

    function login() {
        // Implement actual login logic here
        currentUser = {
            name: 'John Doe',
            email: document.getElementById('loginEmail').value
        };
        updateAccountButton();
        closeForm('loginForm');
    }

    function register() {
        // Implement actual registration logic here
        currentUser = {
            name: document.getElementById('registerName').value,
            email: document.getElementById('registerEmail').value
        };
        updateAccountButton();
        closeForm('registerForm');
    }

    function updateAccountButton() {
        accountBtn.textContent = currentUser ? `Hello, ${currentUser.name}` : 'My Account';
    }

    function closeForm(formId) {
        document.getElementById(formId).remove();
    }

    accountBtn.addEventListener('click', () => {
        if (currentUser) {
            // Show user dashboard or logout option
            alert(`Logged in as ${currentUser.name}`);
        } else {
            showLoginForm();
        }
    });

    // Wishlist functionality
    const wishlistBtn = document.getElementById('wishlistBtn');
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    function updateWishlist() {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        wishlistBtn.textContent = `Wishlist (${wishlist.length})`;
    }

    window.addToWishlist = (productId) => {
        if (!wishlist.includes(productId)) {
            wishlist.push(productId);
            updateWishlist();
            alert('Product added to wishlist!');
        } else {
            alert('This product is already in your wishlist.');
        }
    }

    wishlistBtn.addEventListener('click', () => {
        const wishlistProducts = products.filter(product => wishlist.includes(product.id));
        // Implement wishlist display logic here
        alert(`Your wishlist contains ${wishlistProducts.length} products.`);
    });

    // Review system
    const reviewsList = document.getElementById('reviewsList');
    const reviewForm = document.getElementById('reviewForm');

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = document.getElementById('rating').value;
            const reviewText = document.getElementById('reviewText').value;
            
            // In a real application, you would send this data to a server
            const review = {
                rating,
                text: reviewText,
                user: currentUser ? currentUser.name : 'Anonymous',
                date: new Date().toLocaleDateString()
            };

            // Add the review to the list
            const reviewHtml = `
                <div class="review">
                    <p class="rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
                    <p>${review.text}</p>
                    <p><em>By ${review.user} on ${review.date}</em></p>
                </div>
            `;
            reviewsList.insertAdjacentHTML('beforeend', reviewHtml);

            // Clear the form
            reviewForm.reset();
        });
    }

    // Improve shopping cart with quantity controls
    function updateCartItem(productId, quantity) {
        const index = cartProducts.findIndex(item => item.id === productId);
        if (index !== -1) {
            if (quantity > 0) {
                cartProducts[index].quantity = quantity;
            } else {
                cartProducts.splice(index, 1);
            }
            updateCart();
        }
    }

    function renderCart() {
        cartItems.innerHTML = cartProducts.map(product => `
            <li>
                ${product.name} - $${product.price.toFixed(2)}
                <input type="number" value="${product.quantity}" min="0" 
                    onchange="updateCartItem(${product.id}, this.value)">
            </li>
        `).join('');

        const total = cartProducts.reduce((sum, product) => sum + product.price * product.quantity, 0);
        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cartProducts.reduce((sum, product) => sum + product.quantity, 0);
    }

    window.addToCart = (productId) => {
        const existingProduct = cartProducts.find(item => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            const product = products.find(p => p.id === productId);
            cartProducts.push({...product, quantity: 1});
        }
        updateCart();
    }

    // Initialize
    updateWishlist();
    updateAccountButton();
    // ... (rest of the initialization code)
});
