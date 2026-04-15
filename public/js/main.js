// ======= PAGE LOADER =======
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.page-loader');
    if (loader) loader.classList.add('hidden');
  }, 2200);
});

// ======= CUSTOM CURSOR =======
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');

if (cursor && follower) {
  let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursor.style.left = mouseX - 6 + 'px';
    cursor.style.top = mouseY - 6 + 'px';
  });

  const animateFollower = () => {
    followerX += (mouseX - followerX - 20) * 0.12;
    followerY += (mouseY - followerY - 20) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  };
  animateFollower();

  document.querySelectorAll('a, button, .room-card, .food-card, .price-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.transform = 'scale(2)';
      follower.style.transform = 'scale(1.5)';
      follower.style.borderColor = '#E8C97E';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.transform = 'scale(1)';
      follower.style.transform = 'scale(1)';
      follower.style.borderColor = '#C9A84C';
    });
  });
}

// ======= NAVBAR SCROLL =======
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}

// ======= SCROLL REVEAL =======
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ======= FLASH AUTO DISMISS =======
document.querySelectorAll('.alert').forEach(alert => {
  setTimeout(() => alert.remove(), 5000);
});

// ======= PROFILE TABS =======
const tabBtns = document.querySelectorAll('.tab-btn');
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    const target = document.getElementById(btn.dataset.tab);
    if (target) target.classList.add('active');
  });
});

// ======= ROOM PRICE CALCULATOR =======
const roomTypeSelect = document.getElementById('roomType');
const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const summaryPrice = document.getElementById('summaryPrice');
const summaryNights = document.getElementById('summaryNights');
const summaryTotal = document.getElementById('summaryTotal');
const summaryRoom = document.getElementById('summaryRoom');

const roomPrices = {
  'Deluxe Room': 4999,
  'Premium Suite': 9999,
  'Royal Suite': 18999,
  'Presidential Suite': 34999,
  'Penthouse': 74999
};

function updateRoomSummary() {
  const type = roomTypeSelect?.value;
  const checkIn = new Date(checkInInput?.value);
  const checkOut = new Date(checkOutInput?.value);
  if (!type || isNaN(checkIn) || isNaN(checkOut)) return;
  const nights = Math.max(1, Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24)));
  const pricePerNight = roomPrices[type] || 0;
  const total = pricePerNight * nights;
  if (summaryRoom) summaryRoom.textContent = type;
  if (summaryPrice) summaryPrice.textContent = '₹' + pricePerNight.toLocaleString('en-IN');
  if (summaryNights) summaryNights.textContent = nights + ' night' + (nights > 1 ? 's' : '');
  if (summaryTotal) summaryTotal.textContent = '₹' + total.toLocaleString('en-IN');
}
if (roomTypeSelect) roomTypeSelect.addEventListener('change', updateRoomSummary);
if (checkInInput) checkInInput.addEventListener('change', updateRoomSummary);
if (checkOutInput) checkOutInput.addEventListener('change', updateRoomSummary);

// Set min dates
const today = new Date().toISOString().split('T')[0];
if (checkInInput) { checkInInput.min = today; checkInInput.value = today; }
if (checkOutInput) {
  const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
  checkOutInput.min = tomorrow.toISOString().split('T')[0];
  checkOutInput.value = tomorrow.toISOString().split('T')[0];
}

// ======= TABLE PRICE CALCULATOR =======
const tableTypeSelect = document.getElementById('tableType');
const tableSummaryType = document.getElementById('tableSummaryType');
const tableSummaryPrice = document.getElementById('tableSummaryPrice');

const tablePrices = {
  'Standard Table (2 People)': 500,
  'Family Table (4 People)': 1200,
  'Large Table (6 People)': 2200,
  'Banquet Table (10 People)': 4500,
  'Private Dining Room (20 People)': 15000
};

function updateTableSummary() {
  const type = tableTypeSelect?.value;
  if (!type) return;
  const price = tablePrices[type] || 0;
  if (tableSummaryType) tableSummaryType.textContent = type;
  if (tableSummaryPrice) tableSummaryPrice.textContent = '₹' + price.toLocaleString('en-IN');
}
if (tableTypeSelect) tableTypeSelect.addEventListener('change', updateTableSummary);

// ======= PARALLAX =======
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.3}px)`;
});

// ======= NUMBER COUNTER =======
const counterEls = document.querySelectorAll('.stat-num[data-target]');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      let current = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current) + suffix;
        if (current >= target) clearInterval(timer);
      }, 25);
      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObserver.observe(el));

// ======= CANCEL CONFIRM =======
document.querySelectorAll('.cancel-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    if (!confirm('Are you sure you want to cancel this booking? This cannot be undone.')) {
      e.preventDefault();
    }
  });
});

// Update room summary on load
updateRoomSummary();
