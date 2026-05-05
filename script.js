const cart = new Map();
const cartPanel = document.getElementById("cart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cart-list");
const cartTotal = document.getElementById("total");
const cartCount = document.getElementById("count");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("search");
const productCards = Array.from(document.querySelectorAll(".item"));
const checkoutBtn = document.getElementById("checkout");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"));
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.hidden = false;
  cartPanel.setAttribute("aria-hidden", "false");
}

function closeCart() {
  cartPanel.classList.remove("open");
  overlay.hidden = true;
  cartPanel.setAttribute("aria-hidden", "true");
}

function saveCart() {
  const serializable = Array.from(cart.entries()).map(([name, item]) => ({
    name,
    ...item,
  }));
  localStorage.setItem("come-cone-cart", JSON.stringify(serializable));
}

function loadCart() {
  try {
    const saved = JSON.parse(localStorage.getItem("come-cone-cart") || "[]");
    saved.forEach((item) => cart.set(item.name, item));
  } catch {
    cart.clear();
  }
}

function updateCart() {
  cartItems.innerHTML = "";

  let total = 0;
  let count = 0;

  if (cart.size === 0) {
    cartItems.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
  }

  cart.forEach((item, name) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const row = document.createElement("article");
    row.className = "cart-row";
    row.innerHTML = `
      <img src="${item.image}" alt="${name}">
      <div>
        <h3>${name}</h3>
        <p>${currency.format(item.price)}</p>
      </div>
      <div class="qty" aria-label="Quantidade de ${name}">
        <button type="button" data-action="decrease" data-name="${name}">−</button>
        <span>${item.quantity}</span>
        <button type="button" data-action="increase" data-name="${name}">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });

  cartTotal.textContent = currency.format(total);
  cartCount.textContent = count;
  saveCart();
}

function addToCartFromCard(card) {
  const name = card.dataset.product;
  const price = Number(card.dataset.price);
  const image = card.querySelector("img").getAttribute("src");
  const current = cart.get(name) || { price, quantity: 0, image };
  current.quantity += 1;
  cart.set(name, current);
  updateCart();
  showToast(`${name} adicionado ao carrinho.`);
}

function initCartButtons() {
  document.querySelectorAll(".btn.add").forEach((btn) => {
    btn.addEventListener("click", () =>
      addToCartFromCard(btn.closest(".item")),
    );
  });
}

function filterProducts() {
  const term = searchInput.value.trim().toLowerCase();
  productCards.forEach((card) => {
    const name = card.dataset.name.toLowerCase();
    card.classList.toggle("hidden", term !== "" && !name.includes(term));
  });
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const name = button.dataset.name;
  const item = cart.get(name);
  if (!item) return;

  if (button.dataset.action === "increase") {
    item.quantity += 1;
  } else {
    item.quantity -= 1;
    if (item.quantity <= 0) {
      cart.delete(name);
      showToast(`${name} removido do carrinho.`);
      updateCart();
      return;
    }
  }

  cart.set(name, item);
  updateCart();
});

document.getElementById("cart-open").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
  if (cart.size === 0) {
    showToast("Seu carrinho ainda está vazio.");
    return;
  }
  showToast("Pedido simulado com sucesso!");
  cart.clear();
  updateCart();
  closeCart();
});

searchInput.addEventListener("input", filterProducts);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

loadCart();
updateCart();
initCartButtons();
filterProducts();
