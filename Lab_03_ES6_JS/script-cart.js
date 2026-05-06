
document.addEventListener("DOMContentLoaded", () => {

    let cart = [];

    // Function to add multiple items using Rest operator
    function addToCart(...items) {
        cart.push(...items);
    }

    // Add items to cart
    addToCart("Laptop", "Phone", "Headphones", "Keyboard", "Mouse");

    // Clone cart using Spread operator
    const clonedCart = [...cart];

    // Destructuring: first item & remaining
    const [firstItem, ...remainingItems] = clonedCart;

    // Generate HTML
    let output = `
        <div class="cart-card">
            <h3>Shopping Cart Summary</h3>
            <p><strong>Total Items:</strong> ${cart.length}</p>
            <p><strong>First Item:</strong> ${firstItem}</p>
            <p><strong>Remaining Items:</strong> ${remainingItems.join(", ")}</p>
            <p><strong>Cloned Cart:</strong> ${clonedCart.join(", ")}</p>
        </div>
    `;

    document.getElementById("cart").innerHTML = output;

});