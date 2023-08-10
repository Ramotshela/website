const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartItemsList = document.querySelector('.cart-items');
const cartTotalElement = document.getElementById('cart-total');
const placeOrderButton = document.getElementById('place-order');

let cart = [];
let total = 0;

addToCartButtons.forEach(button => {
    button.addEventListener('click', addToCart);
});

function addToCart(event) {
    const menuItem = event.target.closest('.menu-item');
    const name = menuItem.querySelector('h2').textContent;
    const price = parseFloat(menuItem.querySelector('.price').textContent.slice(1));
    
    cart.push({ name, price });
    total += price;

    updateCart();
}

function updateCart() {
    cartItemsList.innerHTML = '';
    
    cart.forEach(item => {
        const cartItem = document.createElement('li');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <span>${item.name}</span>
            <span>$${item.price.toFixed(2)}</span>
        `;
        cartItemsList.appendChild(cartItem);
    });

    cartTotalElement.textContent = total.toFixed(2);
}

placeOrderButton.addEventListener('click', placeOrder);

function placeOrder() {
    if (cart.length > 0) {
        alert('Order placed successfully!');
        cart = [];
        total = 0;
        updateCart();
    } else {
        alert('Your cart is empty. Add items before placing an order.');
    }
}
