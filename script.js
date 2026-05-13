const PRODUCTS = [
  {
    id: 1,
    name: "PMG Mesh Trucker Hat",
    desc: "Rep the brand. Limited drop. Breathable mesh, structured front, embroidered PMG logo.",
    price: 34.99,
    cents: 3499,
    img: "https://paymegpt.com/objects/generated-images/2/1778637281482-27caf5ae4ffdef4c.png"
  },
  {
    id: 2,
    name: "Neuro Stack Nootropic (Brainergy)",
    desc: "The 2026 brainergy trend is here. Focus, clarity, flow state. 30-day supply of cognitive performance fuel.",
    price: 67.00,
    cents: 6700,
    img: "https://paymegpt.com/objects/generated-images/2/1778637332318-49d727f1dea8ca11.png"
  },
  {
    id: 3,
    name: "AI Millionaires Retreat Fiji Ticket",
    desc: "5 days in Fiji with the top AI entrepreneurs on the planet. Mastermind sessions, beachfront dinners, deal flow. Limited to 40 seats.",
    price: 4997.00,
    cents: 499700,
    img: "https://paymegpt.com/objects/generated-images/2/1778637406227-2ffd33e3f7ab9b01.png"
  },
  {
    id: 4,
    name: "PMG Chatbot King Hoodie",
    desc: "Heavyweight fleece. Oversized fit. Chatbot King embroidered chest. You either run AI or you don't.",
    price: 79.00,
    cents: 7900,
    img: "https://paymegpt.com/objects/generated-images/2/1778637482151-0ff7e979839a6d98.png"
  },
  {
    id: 5,
    name: "Alpha Stack Creatine + Electrolytes",
    desc: "Train harder. Recover faster. Creatine monohydrate + full electrolyte panel. Clean label, zero fillers.",
    price: 54.00,
    cents: 5400,
    img: "https://paymegpt.com/objects/generated-images/2/1778637558773-e1e304d377b1c00d.png"
  },
  {
    id: 6,
    name: "Fiji Retreat VIP Welcome Kit",
    desc: "Exclusive welcome package for Fiji Retreat attendees. PMG gear, branded notebook, personalized itinerary, and VIP swag box shipped to your door before the event.",
    price: 297.00,
    cents: 29700,
    img: "https://paymegpt.com/objects/generated-images/2/1778637641687-19d75cde90d0d4e9.png"
  }
];

let cart = [];

// Render product grid
const grid = document.getElementById('product-grid');
PRODUCTS.forEach(p => {
  grid.innerHTML += `
    <div class="card">
      <img src="${p.img}" alt="${p.name}" loading="lazy">
      <div class="card-body">
        <div class="card-name">${p.name}</div>
        <div class="card-desc">${p.desc}</div>
        <div class="card-footer">
          <div class="card-price">$${p.price.toFixed(2)}</div>
          <button class="btn-add" id="btn-${p.id}" onclick="addToCart(${p.id})">+ Add to Cart</button>
        </div>
      </div>
    </div>
  `;
});

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  // Flash button
  const btn = document.getElementById('btn-' + id);
  btn.textContent = '✓ Added';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = '+ Add to Cart'; btn.classList.remove('added'); }, 1200);
  updateCartUI();
  showToast(`${product.name} added to cart`);
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) removeFromCart(id);
  else updateCartUI();
}

function updateCartUI() {
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalCents = cart.reduce((s, i) => s + i.cents * i.qty, 0);
  const totalDollars = (totalCents / 100).toFixed(2);

  // Count badge
  const badge = document.getElementById('cart-count');
  badge.textContent = totalItems;
  badge.style.display = totalItems > 0 ? 'flex' : 'none';

  // Total
  document.getElementById('cart-total').textContent = '$' + totalDollars;

  // Items list
  const container = document.getElementById('cart-items');
  if (cart.length === 0) {
    container.innerHTML = '<p class="empty-cart">Your cart is empty.<br>Add something built different.</p>';
    return;
  }
  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} each</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
          <span class="qty-val">${item.qty}</span>
          <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
      </div>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cart-overlay').classList.add('open');
  document.getElementById('cart-drawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cart-overlay').classList.remove('open');
  document.getElementById('cart-drawer').classList.remove('open');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2400);
}

function doCheckout() {
  const emailEl = document.getElementById('email');
  const email = emailEl.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.classList.add('error');
    emailEl.focus();
    showToast('Please enter a valid email first');
    setTimeout(() => emailEl.classList.remove('error'), 2000);
    return;
  }
  if (cart.length === 0) {
    showToast('Add something to your cart first');
    return;
  }
  const totalCents = cart.reduce((s, i) => s + i.cents * i.qty, 0);
  const label = cart.length === 1
    ? `${cart[0].name}${cart[0].qty > 1 ? ' x' + cart[0].qty : ''}`
    : `${cart.length} items (${cart.reduce((s,i)=>s+i.qty,0)} units)`;

  const btn = document.getElementById('checkout-btn');
  btn.disabled = true;
  btn.textContent = 'Redirecting to Stripe...';

  if (typeof window.__processDonation === 'function') {
    window.__processDonation(totalCents, label, email);
    setTimeout(() => { btn.disabled = false; btn.textContent = 'Checkout with Stripe →'; }, 4000);
  } else {
    showToast('Stripe checkout is loading, try again in a moment');
    btn.disabled = false;
    btn.textContent = 'Checkout with Stripe →';
  }
}

updateCartUI();