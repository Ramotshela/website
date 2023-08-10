// Get all the "Add To Cart" buttons
const addToCartButtons = document.querySelectorAll('.details button');

// Array to store the cart items
const cart = [];

// Add event listeners to each "Add To Cart" button
addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

// Function to add an item to the cart
function addToCart(event) {
    const menuItem = event.target.closest('.food-items');
    const itemName = menuItem.querySelector('.details-sub h5').textContent;
    const itemPrice = parseFloat(menuItem.querySelector('.price').textContent.slice(1));

    // Add the item to the cart array
    cart.push({ name: itemName, price: itemPrice });

    // Update the cart display
    updateCart();
}

// Function to update the cart display
function updateCart() {
    cartItemsList.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>R${item.price.toFixed(2)}</span>
        `;
        cartItemsList.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2);
}

// Place Order button functionality
const placeOrderButton = document.getElementById('place-order');
placeOrderButton.addEventListener('click', placeOrder);

function placeOrder() {
    if (cart.length > 0) {
        // Create an order object with cart details and current date/time
        const order = {
            items: cart.slice(), // Copy the cart array
            total: getTotalPrice(),
            timestamp: new Date().toLocaleString(),
        };

        // Store the order in local storage
        saveOrder(order);

        alert('Order placed successfully!');
        cart.length = 0; // Clear the cart array
        updateCart();
    } else {
        alert('Your cart is empty. Add items before placing an order.');
    }
}

// Function to calculate the total price
function getTotalPrice() {
    let total = 0;
    cart.forEach(item => {
        total += item.price;
    });
    return total;
}

// Function to save an order in local storage
function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    orders.push(order);
    localStorage.setItem('purchaseHistory', JSON.stringify(orders));
}

// Function to load and display purchase history from local storage
function displayPurchaseHistory() {
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory')) || [];
    const historyList = document.querySelector('.history-list');

    historyList.innerHTML = '';
    purchaseHistory.forEach(order => {
        const historyItem = document.createElement('li');
        historyItem.textContent = `${order.timestamp}: Total R${order.total.toFixed(2)}`;
        historyList.appendChild(historyItem);
    });
}

// Call the function to display purchase history on page load
window.addEventListener('load', displayPurchaseHistory);
// ... Your existing code ...



const cartItemsList = document.querySelector('.cart-items');
const orderHistoryList = document.querySelector('.history-list');
const cartTotalElement = document.getElementById('cart-total');

const purchaseHistoryButton = document.getElementById('purchase-history');
const specialOffersButton = document.getElementById('special-offers');
const toolbar = document.querySelector('.toolbar');
const specialOffersSection = document.querySelector('.special-offers');

let total = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});



placeOrderButton.addEventListener('click', placeOrder);



function addToOrderHistory(order) {
    const orderItem = document.createElement('li');
    orderItem.textContent = `${order.name} - R${order.price.toFixed(2)}`;
    orderHistoryList.appendChild(orderItem);
}

purchaseHistoryButton.addEventListener('click', showPurchaseHistory);
specialOffersButton.addEventListener('click', showSpecialOffers);

function showPurchaseHistory() {
    toolbar.classList.remove('active');
    specialOffersSection.classList.remove('active');
    orderHistoryList.innerHTML = '';
    cartItemsList.style.display = 'none';
    orderHistoryList.style.display = 'block';
    placeOrderButton.style.display = 'none';
}

function showSpecialOffers() {
    toolbar.classList.remove('active');
    orderHistoryList.style.display = 'none';
    cartItemsList.style.display = 'none';
    specialOffersSection.classList.toggle('active');
    placeOrderButton.style.display = 'none';
}
