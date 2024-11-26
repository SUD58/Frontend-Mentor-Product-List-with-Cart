// DOM Elements
const itemsList = document.querySelector("#items-list");
const cartActive = document.querySelector("#cart-active");
const cartInactive = document.querySelector("#cart-inactive");
const cartItemsList = document.querySelector("#cart-items");
const totalPrice = document.querySelector("#total-price");
const cartQuantitySpan = document.querySelector("#cart-number");

// State Variables
let cartQuantity = 0;
const items = [];
const cartItems = [];

// Initialize cart quantity
cartQuantitySpan.textContent = cartQuantity;

// Fetch items from JSON and render them
fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    items.push(...data);
    renderItemsList();
  });

// Render the items list
function renderItemsList() {
  items.forEach((item, index) => {
    const itemElement = createItemElement(item, index);
    itemsList.appendChild(itemElement);
  });
}

// Create individual item element
function createItemElement(item, index) {
  const li = document.createElement("li");
  li.className = "flex flex-col";

  li.innerHTML = `
    <div class="relative mb-8">
      <picture class="rounded-2xl">
        <source srcset="${item.image.mobile}">
        <source srcset="${item.image.tablet}" media="(min-width: 1024px)">
        <source srcset="${item.image.desktop}" media="(min-width: 1280px)">
        <img src="${item.image.thumbnail}" class="rounded-2xl">
      </picture>
      <div data-item-id="${index}" class="button-div">
        ${createAddToCartButton()}
      </div>
    </div>
    <h4 class="text-Frontend-Rose-300">${item.category}</h4>
    <h3 class="text-lg font-bold">${item.name}</h3>
    <p class="font-bold text-Frontend-Red">$${item.price.toFixed(2)}</p>
  `;

  // Attach Add to Cart button listener
  const addToCartButton = li.querySelector(".add-to-cart-button");
  addToCartButton.addEventListener("click", () =>
    handleAddToCart(index, li.querySelector(".button-div")),
  );

  return li;
}

// Create Add to Cart button
function createAddToCartButton() {
  return `
    <button
      class="add-to-cart-button group absolute inset-x-0 -bottom-5 mx-auto flex w-fit gap-2 rounded-full border border-Frontend-Rose-500 bg-white px-8 py-2 hover:border-Frontend-Red"
    >
      <img src="assets/images/icon-add-to-cart.svg" alt="" />
      <p class="font-bold group-hover:text-Frontend-Red">Add to Cart</p>
    </button>
  `;
}

// Handle Add to Cart logic
function handleAddToCart(index, buttonDiv) {
  const item = items[index];

  // Update cart item
  cartItems.push({ ...item, quantity: 1, id: index });
  cartQuantity++;
  updateCartDisplay();

  // Replace Add to Cart button with quantity controls
  renderQuantityControls(buttonDiv, index);
  updateCartList();
  updateTotalPrice();
}

// Render quantity controls
function renderQuantityControls(buttonDiv, itemId) {
  buttonDiv.innerHTML = createQuantityControlHTML();
  attachQuantityListeners(buttonDiv, itemId);
}

// Create quantity control HTML
function createQuantityControlHTML() {
  return `
    <div class="added-to-cart-div absolute inset-x-0 -bottom-5 mx-auto flex w-fit items-center justify-between gap-14 rounded-full bg-Frontend-Red px-2 py-2 text-white">
      <button class="decrement-button group flex aspect-square items-center justify-center rounded-full border p-1 hover:bg-white">
        <svg class="aspect-square w-3 fill-white group-hover:fill-Frontend-Red">
          <use href="#decrement-icon"></use>
        </svg>
      </button>
      <p class="text-xl font-bold">1</p>
      <button class="increment-button group flex aspect-square items-center justify-center rounded-full border p-1 hover:bg-white">
        <svg class="aspect-square w-3 fill-white group-hover:fill-Frontend-Red">
          <use href="#increment-icon"></use>
        </svg>
      </button>
    </div>
  `;
}

// Attach quantity control listeners
function attachQuantityListeners(buttonDiv, itemId) {
  const incrementButton = buttonDiv.querySelector(".increment-button");
  const decrementButton = buttonDiv.querySelector(".decrement-button");
  const quantityDisplay = buttonDiv.querySelector("p");

  incrementButton.addEventListener("click", () =>
    handleQuantityChange(itemId, 1, buttonDiv, quantityDisplay),
  );
  decrementButton.addEventListener("click", () =>
    handleQuantityChange(itemId, -1, buttonDiv, quantityDisplay),
  );
}

// Handle quantity change
function handleQuantityChange(itemId, change, buttonDiv, quantityDisplay) {
  const cartItem = cartItems.find((item) => item.id === itemId);
  if (!cartItem) return;

  cartItem.quantity += change;
  cartQuantity += change;

  if (cartItem.quantity <= 0) {
    // Remove the item from the cart and reset the buttonDiv
    removeCartItem(itemId);
    buttonDiv.innerHTML = createAddToCartButton();
    const addToCartButton = buttonDiv.querySelector(".add-to-cart-button");
    addToCartButton.addEventListener("click", () =>
      handleAddToCart(itemId, buttonDiv),
    );
  } else {
    quantityDisplay.textContent = cartItem.quantity;
  }

  updateCartDisplay();
  updateCartList();
  updateTotalPrice();
}

// Remove cart item
function removeCartItem(itemId) {
  const itemIndex = cartItems.findIndex((item) => item.id === itemId);
  if (itemIndex > -1) {
    cartItems.splice(itemIndex, 1);
  }

  if (cartItems.length === 0) {
    cartActive.classList.add("hidden");
    cartInactive.classList.remove("hidden");
  }
}

// Update cart display
function updateCartDisplay() {
  cartQuantitySpan.textContent = cartQuantity;
  cartActive.classList.toggle("hidden", cartItems.length === 0);
  cartInactive.classList.toggle("hidden", cartItems.length > 0);
}

// Update cart list
function updateCartList() {
  cartItemsList.innerHTML = cartItems.map(createCartItemHTML).join("");
}

// Create individual cart item HTML
function createCartItemHTML(cartItem) {
  return `
    <li class="flex items-center justify-between border-b border-Frontend-Rose-100 pb-4">
      <div class="flex flex-col gap-2">
        <h4 class="font-bold">${cartItem.name}</h4>
        <div class="flex gap-2">
          <p class="font-bold text-Frontend-Red">${cartItem.quantity}</p>
          <p class="text-Frontend-Rose-400">@$${cartItem.price}</p>
          <p class="font-bold text-Frontend-Rose-400">$${(cartItem.quantity * cartItem.price).toFixed(2)}</p>
        </div>
      </div>
      <button class="remove-item-button group flex aspect-square items-center justify-center rounded-full border border-Frontend-Rose-300 p-0.5 hover:border-Frontend-Rose-500">
        <svg class="aspect-square w-3 fill-Frontend-Rose-300 group-hover:fill-Frontend-Rose-500">
          <use href="#remove-item-icon"></use>
        </svg>
      </button>
    </li>
  `;
}

// Update total price
function updateTotalPrice() {
  const totalPriceAmount = cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0,
  );
  totalPrice.textContent = `$${totalPriceAmount.toFixed(2)}`;
}
