const itemsList = document.querySelector("#items-list");
const cartNumber = document.querySelector("#cart-number");
let cartNumberOfItems = 0;

fetch("./data.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    data.forEach((item) => {
      itemsList.insertAdjacentHTML(
        "beforeend",
        `<li id="items-list" class="flex flex-col">
          <div class="relative mb-8">
            <img src="${item.image.mobile}" alt="" class="rounded-2xl" />
            
            <button
              class="add-to-cart-button group absolute inset-x-0 -bottom-5 mx-auto flex w-fit gap-2 rounded-full border border-Frontend-Rose-500 bg-white px-8 py-2 hover:border-Frontend-Red"
            >
              <img src="assets/images/icon-add-to-cart.svg" alt="" />
              <p class="font-bold group-hover:text-Frontend-Red">Add to Cart</p>
            </button>
          </div>
          <h4 class="text-Frontend-Rose-300">${item.category}</h4>
          <h3 class="text-lg font-bold">${item.name}</h3>
          <p class="font-bold text-Frontend-Red">$${item.price}</p>
        </li>`,
      );
    });
    const addToCartButtons = document.querySelectorAll(".add-to-cart-button");
    console.log(addToCartButtons);

    addToCartButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        cartNumberOfItems++;
        cartNumber.textContent = cartNumberOfItems;
        const addToCartButtonSelected = document.createElement("div");
        const addToCartButtonSelectedClasses = [
          "absolute",
          "inset-x-0",
          "-bottom-5",
          "z-10",
          "mx-auto",
          "flex",
          "w-fit",
          "justify-between",
          "gap-14",
          "rounded-full",
          "bg-Frontend-Red",
          "px-2",
          "py-2",
          "text-white",
        ];
        addToCartButtonSelected.classList.add(
          ...addToCartButtonSelectedClasses,
        );
        addToCartButtonSelected.innerHTML = `<button
                class="group flex aspect-square items-center justify-center rounded-full border p-2 hover:bg-white"
              >
                <svg class="aspect-square w-4 group-hover:stroke-Frontend-Red">
                  <use href="#decrement-icon"></use>
                </svg>
              </button>
              <p class="font-bold">1</p>
              <button
                class="group flex aspect-square items-center justify-center rounded-full border p-2 hover:bg-white"
              >
                <svg class="aspect-square w-4 group-hover:stroke-Frontend-Red">
                  <use href="#increment-icon"></use>
                </svg>
              </button>
            </div>`;
        button.replaceWith(addToCartButtonSelected);
      });
    });
  });
