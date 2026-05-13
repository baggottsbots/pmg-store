const PRODUCTS = [
  { id:1, name:"PMG Mesh Trucker Hat",                price:34.99,  cents:3499,   desc:"Rep the brand. Limited drop. Breathable mesh, structured front, embroidered PMG logo.",                                               img:"https://paymegpt.com/objects/generated-images/2/1778637281482-27caf5ae4ffdef4c.png" },
  { id:2, name:"Neuro Stack Nootropic (Brainergy)",   price:67.00,  cents:6700,   desc:"The 2026 brainergy trend is here. Focus, clarity, flow state. 30-day supply of cognitive performance fuel.",                         img:"https://paymegpt.com/objects/generated-images/2/1778637332318-49d727f1dea8ca11.png" },
  { id:3, name:"AI Millionaires Retreat Fiji Ticket", price:4997.00,cents:499700, desc:"5 days in Fiji with top AI entrepreneurs. Mastermind sessions, beachfront dinners, deal flow. 40 seats only.",                     img:"https://paymegpt.com/objects/generated-images/2/1778637406227-2ffd33e3f7ab9b01.png" },
  { id:4, name:"PMG Chatbot King Hoodie",             price:79.00,  cents:7900,   desc:"Heavyweight fleece. Oversized fit. Chatbot King embroidered chest. You either run AI or you don't.",                                 img:"https://paymegpt.com/objects/generated-images/2/1778637482151-0ff7e979839a6d98.png" },
  { id:5, name:"Alpha Stack Creatine + Electrolytes", price:54.00,  cents:5400,   desc:"Train harder. Recover faster. Creatine monohydrate + full electrolyte panel. Clean label, zero fillers.",                           img:"https://paymegpt.com/objects/generated-images/2/1778637558773-e1e304d377b1c00d.png" },
  { id:6, name:"Fiji Retreat VIP Welcome Kit",        price:297.00, cents:29700,  desc:"Exclusive welcome package. PMG gear, branded notebook, personalized itinerary, VIP swag shipped to your door before the event.",    img:"https://paymegpt.com/objects/generated-images/2/1778637641687-19d75cde90d0d4e9.png" }
];

let cart = [];

/* RENDER GRID */
const grid = document.getElementById('grid');
PRODUCTS.forEach((p, i) => {
  const card = document.createElement('div');
  card.className = 'card';
  card.style.transitionDelay = (i * 0.07) + 's';
  const proxyImg = 'https://wsrv.nl/?url=' + encodeURIComponent(p.img) + '&w=600&output=webp';
  card.innerHTML = `
    <div class="card-img-wrap" onclick="openLightbox(${p.id})">
      <img src="${proxyImg}" data-fallback="${p.img}" alt="${p.name}" loading="lazy"
           referrerpolicy="no-referrer" crossorigin="anonymous"
           onerror="this.onerror=null;this.src=this.dataset.fallback;">
    </div>
    <div class="card-body">
      <div class="card-name">${p.name}</div>
      <div class="card-price">$${p.price % 1 === 0 ? p.price.toFixed(0) : p.price.toFixed(2)}</div>
      <div class="card-desc">${p.desc}</div>
      <button class="btn-add" id="btn-${p.id}" onclick="addToCart(${p.id})">
        <span>+ ADD TO CART</span>
      </button>
    </div>`;
  grid.appendChild(card);
});

/* SCROLL REVEAL */
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
}, { threshold: 0.08 });
document.querySelectorAll('.card').forEach(c => io.observe(c));

/* LIGHTBOX */
function openLightbox(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightbox-img');
  const cap = document.getElementById('lightbox-caption');
  const hq = 'https://wsrv.nl/?url=' + encodeURIComponent(p.img) + '&w=1200&output=webp';
  img.src = hq;
  img.dataset.fallback = p.img;
  img.onerror = function(){ this.onerror=null; this.src=this.dataset.fallback; };
  cap.textContent = p.name;
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeCart(); } });

/* CART */
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  const ex = cart.find(x => x.id === id);
  if (ex) ex.qty++;
  else cart.push({ ...p, qty: 1 });
  const btn = document.getElementById('btn-' + id);
  btn.classList.add('flash');
  btn.querySelector('span').textContent = '✓ ADDED';
  setTimeout(() => { btn.classList.remove('flash'); btn.querySelector('span').textContent = '+ ADD TO CART'; }, 1100);
  updateUI();
  openCart();
}

function changeQty(id, d) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += d;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  updateUI();
}

function removeItem(id) { cart = cart.filter(x => x.id !== id); updateUI(); }

function updateUI() {
  const count = cart.reduce((s,i) => s + i.qty, 0);
  const totalCents = cart.reduce((s,i) => s + i.cents * i.qty, 0);
  const badge = document.getElementById('cart-badge');
  const btn = document.getElementById('cart-btn');
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
  btn.classList.toggle('has-items', count > 0);
  document.getElementById('cart-label').textContent = count > 0 ? count : 'Cart';
  document.getElementById('total-val').textContent = '$' + (totalCents / 100).toFixed(2);

  const list = document.getElementById('cart-list');
  if (cart.length === 0) {
    list.innerHTML = '<div class="empty-msg"><span class="empty-icon">🛒</span>Your cart is empty.<br>Add something built different.</div>';
    document.getElementById('order-summary-wrap').innerHTML = '';
    return;
  }
  list.innerHTML = cart.map(item => {
    const thumb = 'https://wsrv.nl/?url=' + encodeURIComponent(item.img) + '&w=120&output=webp';
    return `<div class="ci">
      <img src="${thumb}" data-fallback="${item.img}" alt="${item.name}"
           referrerpolicy="no-referrer" onerror="this.onerror=null;this.src=this.dataset.fallback;">
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        <div class="ci-price">$${(item.cents/100).toFixed(2)} each</div>
        <div class="ci-row">
          <div class="qty-wrap">
            <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
          </div>
          <button class="ci-remove" onclick="removeItem(${item.id})">Remove</button>
        </div>
      </div>
    </div>`;
  }).join('');

  const lines = cart.map(item => {
    const lineTotal = (item.cents * item.qty / 100).toFixed(2);
    const qtyLabel = item.qty > 1 ? ` ×${item.qty}` : '';
    return `<div class="order-line">
      <span class="order-line-name">${item.name}${qtyLabel}</span>
      <span class="order-line-price">$${lineTotal}</span>
    </div>`;
  }).join('');
  document.getElementById('order-summary-wrap').innerHTML = `
    <div class="order-summary">
      <div class="order-summary-title">Order Summary</div>
      ${lines}
    </div>`;
}

function openCart() {
  document.getElementById('overlay').classList.add('open');
  document.getElementById('drawer').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('overlay').classList.remove('open');
  document.getElementById('drawer').classList.remove('open');
  document.body.style.overflow = '';
}

function checkout() {
  const emailEl = document.getElementById('email');
  const email = emailEl.value.trim();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    emailEl.classList.add('shake');
    setTimeout(() => emailEl.classList.remove('shake'), 400);
    closeCart(); emailEl.focus();
    return;
  }
  if (cart.length === 0) { return; }
  const totalCents = cart.reduce((s,i) => s + i.cents * i.qty, 0);
  let labelParts = cart.map(i => {
    const shortName = i.name.split(' ').slice(0,3).join(' ');
    return i.qty > 1 ? `${shortName} ×${i.qty}` : shortName;
  });
  let label = labelParts.join(', ');
  if (label.length > 80) label = label.slice(0, 77) + '...';
  const btn = document.getElementById('checkout-btn');
  btn.disabled = true; btn.textContent = 'REDIRECTING...';
  if (typeof window.__processDonation === 'function') {
    window.__processDonation(totalCents, label, email);
    setTimeout(() => { btn.disabled = false; btn.textContent = 'CHECKOUT →'; }, 5000);
  } else {
    btn.disabled = false; btn.textContent = 'CHECKOUT →';
  }
}

updateUI();