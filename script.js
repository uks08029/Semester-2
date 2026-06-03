/* ============================================================
   Amazon Clone — script.js
   Features:
     1. Cart functionality  (add items, count badge, mini drawer)
     2. Search bar with suggestions
     3. Back to top button
     4. Language / country dropdown toggle
     5. Dark mode toggle
   ============================================================ */

"use strict";

/* ─────────────────────────────────────────────
   1. CART FUNCTIONALITY
───────────────────────────────────────────── */
const cart = {
  items: JSON.parse(localStorage.getItem("az-cart") || "[]"),

  save() {
    localStorage.setItem("az-cart", JSON.stringify(this.items));
  },

  add(product) {
    const existing = this.items.find((i) => i.id === product.id);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ ...product, qty: 1 });
    }
    this.save();
    this.updateBadge();
    cartDrawer.open();
    showToast(`"${product.name}" added to cart`);
  },

  remove(id) {
    this.items = this.items.filter((i) => i.id !== id);
    this.save();
    this.updateBadge();
    cartDrawer.render();
  },

  changeQty(id, delta) {
    const item = this.items.find((i) => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) this.remove(id);
    else {
      this.save();
      this.updateBadge();
      cartDrawer.render();
    }
  },

  total() {
    return this.items.reduce((sum, i) => {
      const price = parseFloat(i.price.replace(/[^0-9.]/g, "")) || 0;
      return sum + price * i.qty;
    }, 0);
  },

  count() {
    return this.items.reduce((sum, i) => sum + i.qty, 0);
  },

  updateBadge() {
    const badge = document.getElementById("cart-badge");
    if (badge) {
      const n = this.count();
      badge.textContent = n;
      badge.style.display = n > 0 ? "flex" : "none";
    }
  },
};

/* ── Cart drawer (slide-in panel) ── */
const cartDrawer = {
  el: null,

  init() {
    /* Create overlay */
    const overlay = document.createElement("div");
    overlay.id = "cart-overlay";
    overlay.addEventListener("click", () => this.close());

    /* Create drawer */
    const drawer = document.createElement("div");
    drawer.id = "cart-drawer";
    drawer.innerHTML = `
      <div class="cart-header">
        <h2>Shopping Cart</h2>
        <button id="cart-close" aria-label="Close cart">✕</button>
      </div>
      <div id="cart-items"></div>
      <div id="cart-footer">
        <div id="cart-total"></div>
        <button id="cart-checkout">Proceed to Checkout</button>
      </div>`;

    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
    this.el = drawer;

    document.getElementById("cart-close").addEventListener("click", () =>
      this.close()
    );
    document
      .getElementById("cart-checkout")
      .addEventListener("click", () =>
        showToast("Checkout is not implemented in this demo.")
      );
  },

  open() {
    this.render();
    this.el.classList.add("open");
    document.getElementById("cart-overlay").classList.add("open");
    document.body.style.overflow = "hidden";
  },

  close() {
    this.el.classList.remove("open");
    document.getElementById("cart-overlay").classList.remove("open");
    document.body.style.overflow = "";
  },

  render() {
    const container = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");
    if (!container) return;

    if (cart.items.length === 0) {
      container.innerHTML =
        '<p class="cart-empty">Your cart is empty.</p>';
      totalEl.textContent = "";
      return;
    }

    container.innerHTML = cart.items
      .map(
        (item) => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <p class="cart-item-name">${item.name}</p>
          <p class="cart-item-price">${item.price}</p>
          <div class="cart-qty">
            <button class="qty-btn" data-action="dec" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-remove" data-id="${item.id}" aria-label="Remove">🗑</button>
      </div>`
      )
      .join("");

    totalEl.innerHTML = `<strong>Subtotal (${cart.count()} items):</strong> ₹${cart
      .total()
      .toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

    /* Qty & remove listeners */
    container.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const delta = btn.dataset.action === "inc" ? 1 : -1;
        cart.changeQty(id, delta);
      });
    });
    container.querySelectorAll(".cart-remove").forEach((btn) => {
      btn.addEventListener("click", () => cart.remove(btn.dataset.id));
    });
  },
};

/* ── Wire "Add to Cart" to product cards ── */
function attachAddToCart() {
  document.querySelectorAll(".intelligence").forEach((card, idx) => {
    const imgEl = card.querySelector("img");
    const h1 = card.querySelector("h1");
    const p = card.querySelector("p");

    if (!h1) return;

    /* Avoid duplicate buttons */
    if (card.querySelector(".add-to-cart-btn")) return;

    const btn = document.createElement("button");
    btn.className = "add-to-cart-btn";
    btn.textContent = "Add to Cart";
    btn.addEventListener("click", () => {
      cart.add({
        id: `product-${idx}`,
        name: h1.textContent.trim(),
        price: p ? p.textContent.trim() : "₹0",
        img: imgEl ? imgEl.src : "",
      });
    });
    card.appendChild(btn);
  });
}

/* ── Cart icon badge ── */
function injectCartBadge() {
  const cartEl = document.querySelector(".cart");
  if (!cartEl) return;
  if (document.getElementById("cart-badge")) return;

  const badge = document.createElement("span");
  badge.id = "cart-badge";
  badge.style.display = "none";
  cartEl.style.position = "relative";
  cartEl.appendChild(badge);

  /* Open drawer on click */
  cartEl.style.cursor = "pointer";
  cartEl.addEventListener("click", () => cartDrawer.open());
}

/* ─────────────────────────────────────────────
   2. SEARCH WITH SUGGESTIONS
───────────────────────────────────────────── */
const suggestions = [
  "Laptop", "Samsung Galaxy", "MacBook Air", "Headphones", "Shirt",
  "Kurta", "Desk Mat", "Office Chair", "Refrigerator", "Microwave",
  "Air Conditioner", "Washing Machine", "Jacket", "Sweater", "Face Wash",
  "Laptop Bag", "Bluetooth Speaker", "Smart TV", "Trimmer", "Running Shoes",
  "Sunglasses", "Watch", "Keyboard", "Mouse", "USB Hub", "Power Bank",
];

function initSearch() {
  const searchInput = document.querySelector(".search input");
  if (!searchInput) return;

  const wrapper = searchInput.parentElement;
  wrapper.style.position = "relative";

  const dropdown = document.createElement("ul");
  dropdown.id = "search-suggestions";
  wrapper.appendChild(dropdown);

  searchInput.addEventListener("input", () => {
    const q = searchInput.value.trim().toLowerCase();
    dropdown.innerHTML = "";

    if (!q) { dropdown.style.display = "none"; return; }

    const matches = suggestions.filter((s) => s.toLowerCase().includes(q));
    if (!matches.length) { dropdown.style.display = "none"; return; }

    matches.slice(0, 8).forEach((s) => {
      const li = document.createElement("li");
      /* Bold the matching part */
      const start = s.toLowerCase().indexOf(q);
      li.innerHTML =
        s.slice(0, start) +
        `<strong>${s.slice(start, start + q.length)}</strong>` +
        s.slice(start + q.length);
      li.addEventListener("mousedown", () => {
        searchInput.value = s;
        dropdown.style.display = "none";
      });
      dropdown.appendChild(li);
    });

    dropdown.style.display = "block";
  });

  searchInput.addEventListener("blur", () => {
    setTimeout(() => (dropdown.style.display = "none"), 150);
  });
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) dropdown.style.display = "block";
  });

  /* Keyboard navigation */
  searchInput.addEventListener("keydown", (e) => {
    const items = dropdown.querySelectorAll("li");
    let active = dropdown.querySelector("li.active");
    if (e.key === "ArrowDown") {
      e.preventDefault();
      active?.classList.remove("active");
      const next = active ? active.nextElementSibling || items[0] : items[0];
      next?.classList.add("active");
      searchInput.value = next?.textContent || searchInput.value;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      active?.classList.remove("active");
      const prev = active
        ? active.previousElementSibling || items[items.length - 1]
        : items[items.length - 1];
      prev?.classList.add("active");
      searchInput.value = prev?.textContent || searchInput.value;
    } else if (e.key === "Escape") {
      dropdown.style.display = "none";
    } else if (e.key === "Enter") {
      dropdown.style.display = "none";
      showToast(`Searching for "${searchInput.value}"…`);
    }
  });

  /* Search button */
  const searchBtn = document.querySelector(".search button");
  searchBtn?.addEventListener("click", () => {
    const q = searchInput.value.trim();
    if (q) showToast(`Searching for "${q}"…`);
  });
}

/* ─────────────────────────────────────────────
   3. BACK TO TOP BUTTON
───────────────────────────────────────────── */
function initBackToTop() {
  /* Re-use the footer panel1 text + add a floating button */
  const panel = document.querySelector(".footpanel1");
  if (panel) {
    panel.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" })
    );
  }

  /* Floating FAB */
  const fab = document.createElement("button");
  fab.id = "back-to-top";
  fab.innerHTML = "&#8679;";
  fab.setAttribute("aria-label", "Back to top");
  document.body.appendChild(fab);

  fab.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" })
  );

  window.addEventListener("scroll", () => {
    fab.style.opacity = window.scrollY > 400 ? "1" : "0";
    fab.style.pointerEvents = window.scrollY > 400 ? "auto" : "none";
  });
}

/* ─────────────────────────────────────────────
   4. LANGUAGE / COUNTRY DROPDOWN TOGGLE
───────────────────────────────────────────── */
function initDropdowns() {
  /* The CSS already handles :focus-within; this adds click + outside-close */
  document.querySelectorAll(".lang-wrapper").forEach((wrapper) => {
    const btn = wrapper.querySelector(".lang-btn");
    const drop = wrapper.querySelector(".lang-dropdown");
    if (!btn || !drop) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = drop.style.display === "block";
      /* Close all others first */
      document
        .querySelectorAll(".lang-dropdown")
        .forEach((d) => (d.style.display = "none"));
      drop.style.display = isOpen ? "none" : "block";
    });
  });

  document.addEventListener("click", () => {
    document
      .querySelectorAll(".lang-dropdown")
      .forEach((d) => (d.style.display = "none"));
  });

  /* Reflect radio selection in button label */
  document.querySelectorAll(".lang-dropdown input[type=radio]").forEach((r) => {
    r.addEventListener("change", () => {
      const wrapper = r.closest(".lang-wrapper");
      const btn = wrapper?.querySelector(".lang-btn");
      const labelText = r.closest("label")?.textContent.trim();
      if (btn && labelText) {
        /* Keep icon, update text part only */
        const textNode = [...btn.childNodes].find(
          (n) => n.nodeType === Node.TEXT_NODE
        );
        if (textNode) textNode.textContent = " " + labelText.replace(/^.*?\s/, "").split(" ")[0] + " ";
      }
      wrapper.querySelector(".lang-dropdown").style.display = "none";
    });
  });
}

/* ─────────────────────────────────────────────
   5. DARK MODE TOGGLE
───────────────────────────────────────────── */
function initDarkMode() {
  /* Build the toggle button */
  const toggle = document.createElement("button");
  toggle.id = "dark-mode-toggle";
  toggle.setAttribute("aria-label", "Toggle dark mode");
  toggle.innerHTML = "🌙";
  document.body.appendChild(toggle);

  /* Persist preference */
  const saved = localStorage.getItem("az-theme");
  if (saved === "dark") applyDark(true);

  toggle.addEventListener("click", () => {
    const isDark = document.body.classList.toggle("dark-mode");
    toggle.innerHTML = isDark ? "☀️" : "🌙";
    localStorage.setItem("az-theme", isDark ? "dark" : "light");
  });

  function applyDark(on) {
    document.body.classList.toggle("dark-mode", on);
    toggle.innerHTML = on ? "☀️" : "🌙";
  }

  /* Inject dark-mode CSS variables */
  const style = document.createElement("style");
  style.textContent = `
    body.dark-mode {
      --page-bg: #0d1117;
      --card-bg: #161b22;
      background: var(--page-bg) !important;
      color: #e6edf3 !important;
    }
    body.dark-mode .card {
      background: #1c2128 !important;
      color: #e6edf3 !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.5) !important;
    }
    body.dark-mode .intelligence {
      background: #1c2128 !important;
      color: #e6edf3 !important;
    }
    body.dark-mode .grid-item p { color: #c9d1d9 !important; }
    body.dark-mode .hero {
      background: #0d1117 !important;
    }
    body.dark-mode .search input {
      background: #1c2128;
      color: #e6edf3;
    }
    body.dark-mode .searchselect {
      background: #30363d;
      color: #e6edf3;
    }
    body.dark-mode #cart-drawer {
      background: #161b22 !important;
      color: #e6edf3 !important;
    }
    body.dark-mode .cart-item {
      border-color: #30363d !important;
      background: #1c2128 !important;
    }
    body.dark-mode #cart-footer {
      background: #1c2128 !important;
      border-color: #30363d !important;
    }
    body.dark-mode .add-to-cart-btn {
      background: #bb8009 !important;
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   TOAST NOTIFICATION
───────────────────────────────────────────── */
function showToast(msg) {
  let toast = document.getElementById("az-toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "az-toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 2800);
}

/* ─────────────────────────────────────────────
   INJECT ALL REQUIRED CSS
───────────────────────────────────────────── */
function injectStyles() {
  const style = document.createElement("style");
  style.textContent = `
    /* ── Cart badge ── */
    #cart-badge {
      position: absolute;
      top: -6px;
      right: -8px;
      background: #f08804;
      color: #111;
      font-size: 11px;
      font-weight: 800;
      min-width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      pointer-events: none;
    }

    /* ── Cart overlay ── */
    #cart-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.55);
      z-index: 200;
    }
    #cart-overlay.open { display: block; }

    /* ── Cart drawer ── */
    #cart-drawer {
      position: fixed;
      top: 0;
      right: -420px;
      width: 420px;
      max-width: 100vw;
      height: 100dvh;
      background: #fff;
      box-shadow: -4px 0 24px rgba(0,0,0,.25);
      z-index: 300;
      display: flex;
      flex-direction: column;
      transition: right .3s ease;
      font-family: Arial, sans-serif;
    }
    #cart-drawer.open { right: 0; }

    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #131921;
      color: #fff;
    }
    .cart-header h2 { margin: 0; font-size: 18px; }
    #cart-close {
      background: none;
      border: none;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }

    #cart-items {
      flex: 1;
      overflow-y: auto;
      padding: 12px 16px;
    }

    .cart-empty {
      text-align: center;
      margin-top: 60px;
      color: #888;
      font-size: 15px;
    }

    .cart-item {
      display: flex;
      gap: 12px;
      align-items: flex-start;
      padding: 12px 0;
      border-bottom: 1px solid #eee;
    }
    .cart-item img {
      width: 70px;
      height: 70px;
      object-fit: cover;
      border-radius: 6px;
      background: #f5f5f5;
    }
    .cart-item-info { flex: 1; }
    .cart-item-name {
      font-size: 13px;
      font-weight: 600;
      margin: 0 0 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .cart-item-price { font-size: 14px; color: #b12704; font-weight: 700; margin: 0 0 6px; }
    .cart-qty { display: flex; align-items: center; gap: 8px; }
    .qty-btn {
      background: #e7e9ec;
      border: 1px solid #adb1b8;
      border-radius: 4px;
      width: 26px;
      height: 26px;
      font-size: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .qty-btn:hover { background: #d5d9d9; }
    .cart-remove {
      background: none;
      border: none;
      font-size: 18px;
      cursor: pointer;
      opacity: .6;
      align-self: center;
    }
    .cart-remove:hover { opacity: 1; }

    #cart-footer {
      padding: 16px 20px;
      border-top: 1px solid #eee;
      background: #f8f8f8;
    }
    #cart-total { font-size: 15px; margin-bottom: 12px; color: #111; }
    #cart-checkout {
      width: 100%;
      padding: 12px;
      background: #ff9900;
      border: none;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
    }
    #cart-checkout:hover { background: #e68a00; }

    /* ── Add to Cart button on product cards ── */
    .add-to-cart-btn {
      display: block;
      width: 100%;
      margin-top: 14px;
      padding: 9px 0;
      background: #ff9900;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      transition: background .2s;
    }
    .add-to-cart-btn:hover { background: #e68a00; }

    /* ── Search suggestions ── */
    #search-suggestions {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #fff;
      border: 1px solid #ccc;
      border-top: none;
      border-radius: 0 0 6px 6px;
      list-style: none;
      margin: 0;
      padding: 0;
      z-index: 100;
      display: none;
      box-shadow: 0 4px 12px rgba(0,0,0,.15);
      max-height: 280px;
      overflow-y: auto;
    }
    #search-suggestions li {
      padding: 9px 14px;
      font-size: 14px;
      color: #111;
      cursor: pointer;
    }
    #search-suggestions li:hover,
    #search-suggestions li.active {
      background: #f3f4f6;
    }
    #search-suggestions li strong { font-weight: 800; }

    /* ── Back to top FAB ── */
    #back-to-top {
      position: fixed;
      bottom: 28px;
      left: 28px;
      width: 44px;
      height: 44px;
      background: #232f3e;
      color: #fff;
      border: none;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity .25s, transform .25s;
      z-index: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #back-to-top:hover { background: #ff9900; transform: translateY(-3px); }

    /* ── Dark mode toggle FAB ── */
    #dark-mode-toggle {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 44px;
      height: 44px;
      background: #232f3e;
      color: #fff;
      border: none;
      border-radius: 50%;
      font-size: 20px;
      cursor: pointer;
      z-index: 500;
      box-shadow: 0 4px 12px rgba(0,0,0,.3);
      transition: background .2s, transform .2s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #dark-mode-toggle:hover { background: #ff9900; transform: scale(1.1); }

    /* ── Toast ── */
    #az-toast {
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%) translateY(20px);
      background: #232f3e;
      color: #fff;
      padding: 10px 22px;
      border-radius: 20px;
      font-size: 14px;
      opacity: 0;
      pointer-events: none;
      transition: opacity .3s, transform .3s;
      z-index: 600;
      white-space: nowrap;
      max-width: 90vw;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    #az-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   INIT — runs when DOM is ready
───────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  injectStyles();
  cartDrawer.init();
  injectCartBadge();
  attachAddToCart();
  cart.updateBadge();
  initSearch();
  initBackToTop();
  initDropdowns();
  initDarkMode();
});