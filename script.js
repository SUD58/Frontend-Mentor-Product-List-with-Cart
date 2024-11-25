const itemsList = document.querySelector("#items-list");
const cartActive = document.querySelector("#cart-active");
const cartInactive = document.querySelector("#cart-inactive");
const cartItemsList = document.querySelector("#cart-items");
const totalPrice = document.querySelector("#total-price");
let cartQuantity = 0;
let totalPriceAmount = 0;
const cartQuantitySpan = document.querySelector("#cart-number");
cartQuantitySpan.textContent = cartQuantity;
const items = [];
const cartItems = [];

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    items.push(...data);
    createItemsList();
  });

function createItemsList() {
  items.map((item) => {
    const itemsTemplate = `
    <li class="flex flex-col">
      <div class="relative mb-8">
        <picture class="rounded-2xl">
          <source srcset="${item.image.mobile}">
          <source srcset="${item.image.tablet}" media="(min-width: 1024px)">
          <source srcset="${item.image.desktop}" media="(min-width: 1280px)">
          <img src="${item.image.thumbnail}" class="rounded-2xl">
        </picture>
        <div class="button-div">
          ${createAddToCartButton()}
        </div>
      </div>
      <h4 class="text-Frontend-Rose-300">${item.category}</h4>
      <h3 class="text-lg font-bold">${item.name}</h3>
      <p class="font-bold text-Frontend-Red">$${item.price.toFixed(2)}</p>
    </li>`;
    itemsList.insertAdjacentHTML("beforeend", itemsTemplate);
  });
  attachAddToCartListeners();
}

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

function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      addToCart(this, index);
    });
  });
}

function addToCart(button, index) {
  const buttonDiv = button.parentNode;
  button.remove();

  cartItems.push(items[index]);

  cartQuantity++;
  cartQuantitySpan.textContent = cartQuantity;

  cartActive.classList.remove("hidden");
  cartInactive.classList.add("hidden");
  populateCartItemsList(cartItems, cartItemsList, buttonDiv);
  setTotalPrice(cartItems);
}

function populateCartItemsList(cartItems = [], cartItemsList, buttonDiv) {
  cartItemsList.innerHTML = cartItems
    .map((cartItem) => {
      cartItem.quantity = 1;
      buttonDiv.innerHTML = createQuantityControlDiv(cartItem.quantity);
      const cartItemsTemplate = `
      <li
      class="flex items-center justify-between border-b border-Frontend-Rose-100 pb-4"
      >
        <div class="flex flex-col gap-2">
          <h4 class="font-bold">${cartItem.name}</h4>
          <div class="flex gap-2">
            <p class="font-bold text-Frontend-Red">${cartItem.quantity}</p>
            <p class="text-Frontend-Rose-400">@$${cartItem.price}</p>
            <p class="font-bold text-Frontend-Rose-400">${cartItem.quantity * cartItem.price}</p>
          </div>
        </div>
        <button class="group flex aspect-square items-center justify-center rounded-full border border-Frontend-Rose-300 p-0.5 hover:border-Frontend-Rose-500">
          <svg class="aspect-square w-3 fill-Frontend-Rose-300 group-hover:fill-Frontend-Rose-500">
            <use href="#remove-item-icon" ></use>
          </svg>
        </button>
      </li>
        `;
      return cartItemsTemplate;
    })
    .join("");
}

function setTotalPrice(cartItems = []) {
  const initialTotal = 0;
  const totalPriceAmount = cartItems.reduce((total, cartItem) => {
    return total + cartItem.price;
  }, initialTotal);
  totalPrice.textContent = `$${totalPriceAmount.toFixed(2)}`;
}

function createQuantityControlDiv(quantity) {
  return `
    <div class="absolute inset-x-0 -bottom-5 mx-auto flex w-fit items-center justify-between gap-14 rounded-full bg-Frontend-Red px-2 py-2 text-white">
      <button class="group flex aspect-square items-center justify-center rounded-full border p-1 hover:bg-white" onclick="decrementItem(this.parentNode, this.parentNode.parentNode)">
        <svg class="aspect-square w-3 fill-white group-hover:fill-Frontend-Red">
          <use href="#decrement-icon"></use>
        </svg>
      </button>
      <p class="text-xl font-bold">${quantity}</p>
      <button class="group flex aspect-square items-center justify-center rounded-full border p-1 hover:bg-white" onclick="incrementItem(this.parentNode)">
        <svg class="aspect-square w-3 fill-white group-hover:fill-Frontend-Red">
          <use href="#increment-icon"></use>
        </svg>
      </button>
    </div>
  `;
}

function incrementItem(addedToCartDiv) {
  const itemQuantityParagraph = addedToCartDiv.querySelector("p");
  let itemQuantity = parseInt(itemQuantityParagraph.textContent, 10);
  itemQuantity++;
  cartQuantity++;
  itemQuantityParagraph.textContent = itemQuantity;
  cartQuantitySpan.textContent = cartQuantity;
}

function decrementItem(addedToCartDiv, buttonDiv) {
  const itemQuantityParagraph = addedToCartDiv.querySelector("p");
  let itemQuantity = parseInt(itemQuantityParagraph.textContent, 10);
  itemQuantity--;
  cartQuantity--;
  cartQuantitySpan.textContent = cartQuantity;

  if (itemQuantity < 1) {
    addedToCartDiv.remove();
    buttonDiv.innerHTML = createAddToCartButton();
    attachAddToCartListeners();
  } else {
    itemQuantityParagraph.textContent = itemQuantity;
  }
}
