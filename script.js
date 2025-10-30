
document.addEventListener('DOMContentLoaded', function () {
    // Cart functionality
    let cart = [];

    // DOM Elements
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartItemsContainer = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartCount = document.getElementById('cart-count');
    const mobileCartCount = document.getElementById('mobile-cart-count');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const paymentForm = document.getElementById('payment-form');
    const paymentTotal = document.getElementById('payment-total');
    const confirmationModal = document.getElementById('confirmation-modal');
    const closeConfirmationBtn = document.getElementById('close-confirmation');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });

    // Mobile login button
    document.getElementById('mobile-login-btn').addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.add('hidden');
        if (currentUser) {
            showUserProfile();
        } else {
            authModalTitle.textContent = 'Login';
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            userProfile.classList.add('hidden');
            authModal.classList.remove('hidden');
        }
    });

    // Toggle cart sidebar
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.remove('translate-x-full');
    });

    closeCartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('translate-x-full');
    });

    // Add to cart functionality
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));

            // Check if item already in cart
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    quantity: 1
                });
            }

            updateCart();
            cartSidebar.classList.remove('translate-x-full');

            // Show added to cart animation
            btn.innerHTML = '<i class="fas fa-check mr-2"></i> Added';
            btn.classList.remove('bg-indigo-600', 'bg-purple-600');
            btn.classList.add('bg-green-500');

            setTimeout(() => {
                btn.innerHTML = 'Add to Cart';
                btn.classList.remove('bg-green-500');
                if (id === '1') {
                    btn.classList.add('bg-indigo-600');
                } else {
                    btn.classList.add('bg-purple-600');
                }
            }, 1500);
        });
    });

    // Update cart UI
    function updateCart() {
        // Update cart items
        if (cart.length === 0) {
            emptyCartMessage.classList.remove('hidden');
            cartItemsContainer.innerHTML = '';
        } else {
            emptyCartMessage.classList.add('hidden');

            let itemsHTML = '';
            cart.forEach(item => {
                itemsHTML += `
                        <div class="cart-item bg-gray-50 rounded-lg p-4 mb-3 flex justify-between items-center">
                            <div>
                                <h4 class="font-medium">${item.name}</h4>
                                <p class="text-sm text-gray-600">₹${item.price.toFixed(2)} x 
                                    <input type="number" min="1" value="${item.quantity}" data-id="${item.id}" class="cart-qty-input w-12 px-1 py-0.5 border rounded text-center ml-1" style="width:48px;"/>
                                </p>
                            </div>
                            <div class="flex items-center">
                                <span class="font-bold mr-4">₹${(item.price * item.quantity).toFixed(2)}</span>
                                <button class="remove-item text-red-500 hover:text-red-700" data-id="${item.id}">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
            });

            cartItemsContainer.innerHTML = itemsHTML;

            // Quantity input event
            document.querySelectorAll('.cart-qty-input').forEach(input => {
                input.addEventListener('change', (e) => {
                    const id = input.getAttribute('data-id');
                    let val = parseInt(input.value);
                    if (isNaN(val) || val < 1) val = 1;
                    input.value = val;
                    const item = cart.find(i => i.id === id);
                    if (item) {
                        item.quantity = val;
                        updateCart();
                    }
                });
            });

            // Remove buttons
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = btn.getAttribute('data-id');
                    cart = cart.filter(item => item.id !== id);
                    updateCart();
                });
            });
        }

        // Update cart totals (no shipping)
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartSubtotal.textContent = `₹${subtotal.toFixed(2)}`;
        cartTotal.textContent = `₹${subtotal.toFixed(2)}`;
        paymentTotal.textContent = subtotal.toFixed(2);

        // Update cart count
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        mobileCartCount.textContent = totalItems;
    }

    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            cartSidebar.classList.add('translate-x-full');
            checkoutModal.classList.remove('hidden');
        }
    });

    // Close checkout modal
    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.add('hidden');
    });

    // Payment tabs
    const cardTab = document.getElementById('card-tab');
    const upiTab = document.getElementById('upi-tab');
    const cardPayment = document.getElementById('card-payment');
    const upiPayment = document.getElementById('upi-payment');
    const upiAmount = document.getElementById('upi-amount');
    const upiPayButton = document.getElementById('upi-pay-button');
    const upiQrCode = document.getElementById('upi-qr-code');

    cardTab.addEventListener('click', () => {
        cardTab.classList.add('border-indigo-600', 'text-indigo-600');
        upiTab.classList.remove('border-indigo-600', 'text-indigo-600');
        cardPayment.classList.remove('hidden');
        upiPayment.classList.add('hidden');
    });

    upiTab.addEventListener('click', () => {
        upiTab.classList.add('border-indigo-600', 'text-indigo-600');
        cardTab.classList.remove('border-indigo-600', 'text-indigo-600');
        upiPayment.classList.remove('hidden');
        cardPayment.classList.add('hidden');

        // Generate total in INR
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        upiAmount.textContent = total.toFixed(2);

        // Generate a simple QR code (in a real app, use a QR code library)
        upiQrCode.innerHTML = `
                <div class="text-center">
                    <div class="w-40 h-40 bg-white p-2 mx-auto">
                        <div class="grid grid-cols-8 gap-1">
                            ${Array(64).fill().map(() =>
            `<div class="w-full h-3 ${Math.random() > 0.3 ? 'bg-black' : 'bg-white'}"></div>`
        ).join('')}
                        </div>
                    </div>
                    <p class="text-xs mt-2">Scan to pay ₹${total.toFixed(2)}</p>
                </div>
            `;
    });

    // Generate random booking ID
    function generateBookingId() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = 'AC-';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Payment form submission
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        completeOrder();
    });

    // UPI payment button
    upiPayButton.addEventListener('click', () => {
        completeOrder();
    });

    function completeOrder() {
        checkoutModal.classList.add('hidden');
        confirmationModal.classList.remove('hidden');

        // Set booking ID
        document.getElementById('booking-id').textContent = generateBookingId();

        // Clear the cart
        cart = [];
        updateCart();
    }

    // Close confirmation modal
    closeConfirmationBtn.addEventListener('click', () => {
        confirmationModal.classList.add('hidden');
    });

    // Auth functionality
    const authModal = document.getElementById('auth-modal');
    const loginBtn = document.getElementById('login-btn');
    const closeAuthBtn = document.getElementById('close-auth');
    const loginTab = document.getElementById('login-tab');
    const signupTab = document.getElementById('signup-tab');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const userProfile = document.getElementById('user-profile');
    const logoutBtn = document.getElementById('logout-btn');
    const authModalTitle = document.getElementById('auth-modal-title');

    // Check if user is logged in
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // Toggle auth modal
    loginBtn.addEventListener('click', () => {
        if (currentUser) {
            showUserProfile();
        } else {
            authModalTitle.textContent = 'Login';
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
            userProfile.classList.add('hidden');
            authModal.classList.remove('hidden');
        }
    });

    closeAuthBtn.addEventListener('click', () => {
        authModal.classList.add('hidden');
    });

    // Switch between login and signup tabs
    loginTab.addEventListener('click', () => {
        authModalTitle.textContent = 'Login';
        loginTab.classList.add('border-indigo-600', 'text-indigo-600');
        signupTab.classList.remove('border-indigo-600', 'text-indigo-600');
        loginForm.classList.remove('hidden');
        signupForm.classList.add('hidden');
    });

    signupTab.addEventListener('click', () => {
        authModalTitle.textContent = 'Sign Up';
        signupTab.classList.add('border-indigo-600', 'text-indigo-600');
        loginTab.classList.remove('border-indigo-600', 'text-indigo-600');
        signupForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
    });

    // Login form submission
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        // In a real app, you would verify credentials with a backend
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            showUserProfile();
            updateAuthUI();
        } else {
            alert('Invalid credentials!');
        }
    });

    // Signup form submission
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const rollno = document.getElementById('signup-rollno').value;
        const password = document.getElementById('signup-password').value;

        const users = JSON.parse(localStorage.getItem('users')) || [];

        // Check if user already exists
        if (users.some(u => u.email === email)) {
            alert('User already exists!');
            return;
        }

        const newUser = { name, email, rollno, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        showUserProfile();
        updateAuthUI();
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        localStorage.removeItem('currentUser');
        authModal.classList.add('hidden');
        updateAuthUI();
    });

    // Show user profile in modal
    function showUserProfile() {
        document.getElementById('user-name').textContent = currentUser.name;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-rollno').textContent = `Roll No: ${currentUser.rollno}`;

        authModalTitle.textContent = 'Profile';
        loginForm.classList.add('hidden');
        signupForm.classList.add('hidden');
        userProfile.classList.remove('hidden');
        // Instead of showing the modal, show a cash at counter message
        checkoutModal.classList.add('hidden');
        confirmationModal.classList.remove('hidden');
        document.getElementById('booking-id').textContent = generateBookingId();
        // Show a message for cash payment
        const confirmationModalBox = document.querySelector('#confirmation-modal .text-center');
        if (confirmationModalBox && !confirmationModalBox.querySelector('.cash-message')) {
            const cashMsg = document.createElement('p');
            cashMsg.className = 'cash-message text-indigo-600 font-semibold mb-4';
            cashMsg.textContent = 'Please pay the total amount in cash at the counter when you collect your order.';
            confirmationModalBox.insertBefore(cashMsg, confirmationModalBox.children[3]);
        }
        cart = [];
        updateCart();
    }

    // Update UI based on auth state
    function updateAuthUI() {
        if (currentUser) {
            loginBtn.textContent = currentUser.name.split(' ')[0];
            loginBtn.innerHTML = `<i class="fas fa-user-circle mr-2"></i>${currentUser.name.split(' ')[0]}`;
        } else {
            loginBtn.textContent = 'Login';
            loginBtn.innerHTML = 'Login';
        }
    }

    // Initialize auth UI
    updateAuthUI();

    // Fix Add to Cart button layout (move text inside button)
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        if (!btn.textContent.trim()) {
            btn.textContent = 'Add to Cart';
        }
    });

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.add('hidden');
        }
        if (e.target === confirmationModal) {
            confirmationModal.classList.add('hidden');
        }
    });
}); // End DOMContentLoaded
