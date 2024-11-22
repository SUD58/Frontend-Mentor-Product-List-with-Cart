const itemsList = document.querySelector("#items-list");
let cartQuantity = 0;
const cartQuantitySpan = document.querySelector("#cart-number");
cartQuantitySpan.textContent = cartQuantity;

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    data.forEach((item) => {
      const itemsTemplate = `
      <li class="flex flex-col">
        <div class="relative mb-8">
          <img src="${item.image.mobile}" alt="" class="rounded-2xl" />
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
  });

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

function addToCart(button) {
  cartQuantity++;
  cartQuantitySpan.textContent = cartQuantity;

  const buttonDiv = button.parentNode;
  button.remove();

  let itemQuantity = 1;

  buttonDiv.innerHTML = createQuantityControlDiv(itemQuantity);
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

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      addToCart(this);
    });
  });
}
