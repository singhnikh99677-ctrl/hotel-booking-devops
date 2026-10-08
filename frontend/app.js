const API = "/api";

let hotels = [];
let selectedHotel = null;

const hotelList = document.getElementById("hotelList");
const bookingList = document.getElementById("bookingList");
const modal = document.getElementById("bookingModal");

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function daysBetween(start, end) {
  const a = new Date(start);
  const b = new Date(end);
  return Math.max(1, Math.ceil((b - a) / 86400000));
}

function renderHotels(items) {
  hotelList.innerHTML = "";
  document.getElementById("resultCount").textContent = `${items.length} hotel${items.length !== 1 ? "s" : ""}`;
  document.getElementById("emptyMessage").classList.toggle("hidden", items.length > 0);

  items.forEach(hotel => {
    const card = document.createElement("article");
    card.className = "hotel-card";
    card.innerHTML = `
      <img class="hotel-image" src="${hotel.image}" alt="${hotel.name}">
      <div class="hotel-body">
        <h3>${hotel.name}</h3>
        <div class="location">📍 ${hotel.place}</div>
        <div class="tags">${hotel.amenities.map(a => `<span class="tag">${a}</span>`).join("")}</div>
        <div class="hotel-bottom">
          <div class="price"><strong>${money(hotel.pricePerNight)}</strong><small> / night</small></div>
          <button class="primary-btn book-btn" data-id="${hotel._id}">Book now</button>
        </div>
      </div>
    `;
    hotelList.appendChild(card);
  });

  document.querySelectorAll(".book-btn").forEach(btn => {
    btn.addEventListener("click", () => openBooking(btn.dataset.id));
  });
}

async function loadHotels() {
  try {
    const response = await fetch(`${API}/hotels`);
    hotels = await response.json();
    renderHotels(hotels);
  } catch {
    showToast("Backend is not running. Start Docker first.");
  }
}

function openBooking(id) {
  selectedHotel = hotels.find(h => h._id === id);
  if (!selectedHotel) return;
  document.getElementById("selectedHotelId").value = selectedHotel._id;
  document.getElementById("modalHotelName").textContent = selectedHotel.name;
  document.getElementById("modalHotelPlace").textContent = `📍 ${selectedHotel.place} • ${money(selectedHotel.pricePerNight)} per night`;
  document.getElementById("modalGuests").value = document.getElementById("guests").value || 2;
  document.getElementById("modalCheckIn").value = document.getElementById("checkIn").value;
  document.getElementById("modalCheckOut").value = document.getElementById("checkOut").value;
  document.getElementById("bookingMessage").textContent = "";
  updateTotal();
  modal.classList.remove("hidden");
}

function updateTotal() {
  if (!selectedHotel) return;
  const start = document.getElementById("modalCheckIn").value;
  const end = document.getElementById("modalCheckOut").value;
  if (!start || !end) {
    document.getElementById("modalTotal").textContent = money(0);
    return;
  }
  const nights = daysBetween(start, end);
  document.getElementById("modalTotal").textContent = money(nights * selectedHotel.pricePerNight);
}

async function submitBooking(event) {
  event.preventDefault();
  const guestName = document.getElementById("guestName").value.trim();
  const checkIn = document.getElementById("modalCheckIn").value;
  const checkOut = document.getElementById("modalCheckOut").value;
  const guests = Number(document.getElementById("modalGuests").value);

  if (new Date(checkOut) <= new Date(checkIn)) {
    document.getElementById("bookingMessage").textContent = "Check-out must be after check-in.";
    return;
  }

  try {
    const response = await fetch(`${API}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hotelId: selectedHotel._id, guestName, checkIn, checkOut, guests })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Booking failed");

    modal.classList.add("hidden");
    document.getElementById("bookingForm").reset();
    showToast(`Booking confirmed! Total: ${money(data.booking.totalAmount)}`);
    await loadBookings();
    document.getElementById("bookings").scrollIntoView({ behavior: "smooth" });
  } catch (error) {
    document.getElementById("bookingMessage").textContent = error.message;
  }
}

async function loadBookings() {
  try {
    const response = await fetch(`${API}/bookings`);
    const bookings = await response.json();
    if (!bookings.length) {
      bookingList.innerHTML = `<div class="empty">No bookings yet. Pick a hotel above.</div>`;
      return;
    }
    bookingList.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <div><strong>${b.hotelName}</strong><span>📍 ${b.place}</span></div>
        <div><strong>${b.guestName}</strong><span>${b.guests} guest(s)</span></div>
        <div><strong>${b.checkIn} → ${b.checkOut}</strong><span>${b.nights} night(s)</span></div>
        <div><strong>${money(b.totalAmount)}</strong><span class="status">${b.status}</span></div>
      </div>
    `).join("");
  } catch {
    bookingList.innerHTML = `<div class="empty">Could not load bookings.</div>`;
  }
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.style.display = "block";
  setTimeout(() => toast.style.display = "none", 3500);
}

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchPlace").value.trim().toLowerCase();
  renderHotels(query ? hotels.filter(h => h.place.toLowerCase().includes(query)) : hotels);
  document.getElementById("hotels").scrollIntoView({ behavior: "smooth" });
});

document.getElementById("closeModal").addEventListener("click", () => modal.classList.add("hidden"));
document.getElementById("refreshBookings").addEventListener("click", loadBookings);
document.getElementById("bookingForm").addEventListener("submit", submitBooking);
document.getElementById("modalCheckIn").addEventListener("change", updateTotal);
document.getElementById("modalCheckOut").addEventListener("change", updateTotal);
document.getElementById("modalGuests").addEventListener("change", updateTotal);

const today = new Date().toISOString().split("T")[0];
document.getElementById("checkIn").min = today;
document.getElementById("checkOut").min = today;
document.getElementById("modalCheckIn").min = today;
document.getElementById("modalCheckOut").min = today;

loadHotels();
loadBookings();
