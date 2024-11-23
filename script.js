const itemsList = document.querySelector("#items-list");
const cartItemsList = document.querySelector("#cart-items-list");
let cartQuantity = 0;
const cartQuantitySpan = document.querySelector("#cart-number");
cartQuantitySpan.textContent = cartQuantity;
const items = [];

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    items.push(...data);
    createItemsList();
  });

console.log(items);

function createItemsList() {
  items.forEach((item) => {
    console.log(item);

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

function addToCart(button, index) {
  const buttonDiv = button.parentNode;
  button.remove();

  let itemQuantity = 1;

  buttonDiv.innerHTML = createQuantityControlDiv(itemQuantity);

  const cartItemsTemplate = `
    <div
      class="flex max-h-60 flex-col gap-4 overflow-auto text-sm"
    >
      <div
        class="flex items-center justify-between border-b border-Frontend-Rose-100 pb-4"
      >
        <div class="flex flex-col gap-2">
          <h4 class="font-bold">${items[index].name}</h4>
          <div class="flex gap-2">
            <p class="font-bold text-Frontend-Red">${itemQuantity}</p>
            <p class="text-Frontend-Rose-400">@$${items[index].price}</p>
            <p class="font-bold text-Frontend-Rose-400">${itemQuantity * items[index].price}</p>
          </div>
        </div>
        <button>
          <img
            src="assets/images/icon-remove-item.svg"
            alt=""
            class="rounded-full border border-Frontend-Rose-300 p-0.5"
          />
        </button>
      </div>
    </div>
    `;
  if (cartQuantity === 0) {
    cartItemsList.innerHTML = cartItemsTemplate;
    cartQuantity++;
    cartQuantitySpan.textContent = cartQuantity;
  } else {
    cartItemsList.insertAdjacentHTML("beforeend", cartItemsTemplate);
    cartQuantity++;
    cartQuantitySpan.textContent = cartQuantity;
  }
}

function createQuantityControlDiv(quantity) {
  return `
    <div class="absolute inset-x-0 -bottom-5 mx-auto flex w-fit items-center justify-between gap-14 rounded-full bg-Frontend-Red px-2 py-2 text-white">
      <button class="group flex aspect-square items-center justify-center rounded-full border p-2 hover:bg-white" onclick="decrementItem(this.parentNode, this.parentNode.parentNode)">
        <svg class="aspect-square w-3 group-hover:stroke-Frontend-Red">
          <use href="#decrement-icon"></use>
        </svg>
      </button>
      <p class="text-xl font-bold">${quantity}</p>
      <button class="group flex aspect-square items-center justify-center rounded-full border p-2 hover:bg-white" onclick="incrementItem(this.parentNode)">
        <svg class="aspect-square w-3 group-hover:stroke-Frontend-Red">
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

function attachAddToCartListeners() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-button");

  addToCartButtons.forEach((button, index) => {
    button.addEventListener("click", function () {
      addToCart(this, index);
    });
  });
}
