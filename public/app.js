const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const toast = $("#toast");
let toastTimer;
function showToast(message) {
  $("span", toast).textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

const header = $(".site-header");
const onScroll = () => header.classList.toggle("scrolled", scrollY > 30);
addEventListener("scroll", onScroll, { passive: true });
onScroll();

const mobileMenu = $(".mobile-menu");
$(".menu-button").addEventListener("click", () => mobileMenu.classList.add("open"));
$(".mobile-close").addEventListener("click", () => mobileMenu.classList.remove("open"));
$$('.mobile-menu a').forEach((link) => link.addEventListener("click", () => mobileMenu.classList.remove("open")));

const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add("visible");
}), { threshold: .12 });
$$('.reveal').forEach((item) => observer.observe(item));

const roomData = {
  "Deluxe King": { label: "DELUXE KING", bed: "King Size", copy: "Tersedia dengan pilihan ranjang King Size." },
  "Premier Twin": { label: "PREMIER TWIN", bed: "", copy: "Tersedia untuk dipesan melalui Traveloka." },
  "Premier King": { label: "PREMIER KING", bed: "", copy: "Tersedia untuk dipesan melalui Traveloka." }
};
const detailDialog = $("#detailDialog");
function openRoom(name) {
  const room = roomData[name];
  $("#dialogContent").innerHTML = `<p class="eyebrow">${room.label}</p><h2>${name}</h2><p>${room.copy}</p>${room.bed ? `<div class="room-meta"><span>Bed: ${room.bed}</span></div>` : ""}<p>Harga bergantung pada tanggal check-in yang dipilih.</p><div class="dialog-price"><span>Price range</span><strong>Rp 1.100.000–Rp 2.500.000+</strong><small>/malam</small></div><p>Promo dapat berupa “Diskon s.d. 50% + Gratis Pembatalan” atau kode JALANYUK. Tambahan sarapan di lokasi untuk pemesanan tanpa sarapan dikenakan Rp 200.000/tamu.</p>`;
  detailDialog.showModal();
}
$$('[data-room]').forEach((button) => button.addEventListener("click", () => openRoom(button.dataset.room)));
$$('.room-tabs button').forEach((button) => button.addEventListener("click", () => {
  $$('.room-tabs button').forEach((item) => item.classList.toggle("active", item === button));
  $$('.room-card').forEach((card) => card.hidden = button.dataset.roomFilter !== "all" && card.dataset.category !== button.dataset.roomFilter);
}));

const facilityData = {
  "Swimming Pools": ["Kolam renang besar outdoor", "Kolam renang khusus anak", "Kolam renang indoor dengan air hangat"],
  "Health & Relaxation": ["Fitness center", "Spa", "Jacuzzi", "Sauna"],
  "Entertainment & Children": ["Kids club", "Playground indoor", "Playground outdoor", "Ruang permainan dengan meja biliar dan tenis meja", "Taman untuk bersantai"],
  "Restaurants & Bar": ["Total 3 restoran", "The Peak — sarapan menu Nusantara dan Western", "Skydome Infinite8 Eateria — lounge & bar eksklusif bergaya kubah dengan pemandangan kota dan pegunungan"],
  "General & Business": ["Resepsionis 24 jam", "WiFi", "AC", "Lift", "Area parkir", "Room service", "Layanan laundry", "Concierge", "Business center", "Meeting rooms"],
};
$$('[data-facility]').forEach((button) => button.addEventListener("click", () => {
  const name = button.dataset.facility;
  $("#dialogContent").innerHTML = `<p class="eyebrow">HOTEL EXPERIENCE</p><h2>${name}</h2><p>Everything you need, without leaving the resort.</p><ul>${facilityData[name].map((item) => `<li>✓ ${item}</li>`).join("")}</ul>`;
  detailDialog.showModal();
}));
$$('dialog .dialog-close').forEach((button) => button.addEventListener("click", () => button.closest("dialog").close()));
$$('dialog').forEach((dialog) => dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
}));

const bookingDialog = $("#bookingDialog");
$$('[data-book]').forEach((button) => button.addEventListener("click", () => bookingDialog.showModal()));
$("#bookingForm").addEventListener("submit", (event) => {
  event.preventDefault();
  bookingDialog.close();
  showToast("Availability request simulated — prototype mode");
});

// Lightweight panorama panning with pointer, touch, keyboard, and zoom controls.
const panorama = $("#panorama");
const panoramaImage = $("#panoramaImage");
let pan = -18.75, zoom = 1, dragging = false, startX = 0, startPan = pan;
function updatePan() {
  pan = Math.max(-47, Math.min(-1, pan));
  panorama.style.setProperty("--pan-x", `${pan}%`);
  panorama.style.setProperty("--pan-zoom", zoom);
}
panorama.addEventListener("pointerdown", (event) => { dragging = true; startX = event.clientX; startPan = pan; panorama.setPointerCapture(event.pointerId); });
panorama.addEventListener("pointermove", (event) => { if (dragging) { pan = startPan + (event.clientX - startX) / panorama.clientWidth * 45; updatePan(); } });
panorama.addEventListener("pointerup", () => dragging = false);
panorama.addEventListener("pointercancel", () => dragging = false);
panorama.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") { pan += event.key === "ArrowLeft" ? 3 : -3; updatePan(); }
});
$("#zoomIn").addEventListener("click", () => { zoom = Math.min(1.35, zoom + .1); updatePan(); });
$("#zoomOut").addEventListener("click", () => { zoom = Math.max(1, zoom - .1); updatePan(); });
$("#resetView").addEventListener("click", () => { pan = innerWidth < 760 ? -28 : -18.75; zoom = 1; updatePan(); });
function setScene(src, label, trigger) {
  panoramaImage.style.filter = "blur(7px)";
  panoramaImage.src = src;
  panoramaImage.alt = `Panorama 360 ${label || "hotel"}`;
  panoramaImage.onload = () => panoramaImage.style.filter = "none";
  pan = innerWidth < 760 ? -28 : -18.75; zoom = 1; updatePan();
  if (trigger) $$('.tour-scenes button').forEach((item) => item.classList.toggle("active", item === trigger));
}
$$('.tour-scenes button').forEach((button) => button.addEventListener("click", () => setScene(button.dataset.scene, button.dataset.label, button)));

const aiPanel = $("#aiPanel");
function toggleAI(open = !aiPanel.classList.contains("open")) {
  aiPanel.classList.toggle("open", open);
  if (open) setTimeout(() => $("#aiInput").focus(), 150);
}
$("#aiLauncher").addEventListener("click", () => toggleAI());
$("#mobileChat").addEventListener("click", () => toggleAI(true));
$("#aiClose").addEventListener("click", () => toggleAI(false));

const hotelKnowledge = `Golden Tulip Holland Resort Batu memiliki 260 kamar di 7 lantai. Tipe kamar: Deluxe King dengan pilihan ranjang King Size, Premier Twin, dan Premier King. Harga bergantung tanggal check-in, umumnya Rp 1.100.000 hingga Rp 2.500.000+ per malam. Promo dapat berupa Diskon s.d. 50% + Gratis Pembatalan atau kode JALANYUK. Tambahan sarapan di lokasi untuk kamar tanpa sarapan adalah Rp 200.000 per tamu. Fasilitas kolam: kolam renang besar outdoor, kolam anak, dan kolam indoor air hangat. Kesehatan dan relaksasi: fitness center, spa, jacuzzi, sauna. Hiburan: kids club, playground indoor dan outdoor, ruang permainan dengan meja biliar dan tenis meja, taman untuk bersantai. Terdapat total 3 restoran. The Peak menyediakan sarapan Nusantara dan Western. Skydome Infinite8 Eateria adalah lounge dan bar eksklusif bergaya kubah dengan pemandangan kota dan pegunungan. Fasilitas umum dan bisnis: resepsionis 24 jam, WiFi, AC, lift, area parkir, room service, laundry, concierge, business center, dan meeting rooms.`;
function localAI(question) {
  const q = question.toLowerCase();
  if (/keluarga|family|anak/.test(q)) return "Fasilitas keluarga meliputi kolam anak, Kids Club, playground indoor dan outdoor, ruang permainan dengan meja biliar dan tenis meja, serta taman untuk bersantai.";
  if (/kolam|pool|renang|hangat/.test(q)) return "Tersedia kolam renang besar outdoor, kolam renang khusus anak, dan kolam renang indoor dengan air hangat.";
  if (/harga|rate|price|berapa|promo/.test(q)) return "Kisaran harga umumnya Rp 1.100.000 hingga Rp 2.500.000+ per malam dan bergantung pada tanggal check-in. Promo dapat berupa Diskon s.d. 50% + Gratis Pembatalan atau kode JALANYUK.";
  if (/makan|restoran|food|breakfast|sarapan/.test(q)) return "Terdapat total 3 restoran. The Peak menyediakan sarapan Nusantara dan Western. Skydome Infinite8 Eateria adalah lounge & bar eksklusif bergaya kubah dengan pemandangan kota dan pegunungan. Tambahan sarapan di lokasi untuk kamar tanpa sarapan adalah Rp 200.000/tamu.";
  if (/kamar|room|deluxe|premier/.test(q)) return "Tipe kamar yang tersedia adalah Deluxe King dengan pilihan ranjang King Size, Premier Twin, dan Premier King.";
  return "Saya bisa membantu tentang tipe kamar, kisaran harga, promo, sarapan, fasilitas resor, restoran, dan tur 360°. Apa yang ingin Anda ketahui?";
}
async function askGemini(question) {
  const key = sessionStorage.getItem("gt_gemini_key");
  const model = sessionStorage.getItem("gt_gemini_model") || "gemini-2.5-flash";
  if (!key) return localAI(question);
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ systemInstruction: { parts: [{ text: `You are GT AI, a concise bilingual hotel concierge. Answer using only this hotel information. If unsure, say that hotel staff should confirm. ${hotelKnowledge}` }] }, contents: [{ role: "user", parts: [{ text: question }] }], generationConfig: { temperature: .35, maxOutputTokens: 280 } })
  });
  if (!response.ok) throw new Error("Gemini request failed");
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.map((part) => part.text).join(" ") || localAI(question);
}
function addMessage(text, role) {
  const message = document.createElement("div");
  message.className = `message ${role}`;
  message.textContent = text;
  $("#aiMessages").append(message);
  $("#aiMessages").scrollTop = $("#aiMessages").scrollHeight;
  return message;
}
async function sendQuestion(question) {
  if (!question.trim()) return;
  addMessage(question.trim(), "user");
  const typing = addMessage("GT AI is thinking…", "bot typing");
  try { typing.textContent = await askGemini(question.trim()); }
  catch { typing.textContent = `${localAI(question)} (Gemini tidak merespons; jawaban demo lokal ditampilkan.)`; }
  typing.classList.remove("typing");
  $("#aiMessages").scrollTop = $("#aiMessages").scrollHeight;
}
$("#aiForm").addEventListener("submit", (event) => { event.preventDefault(); const input = $("#aiInput"); sendQuestion(input.value); input.value = ""; });
$$('.quick-prompts button').forEach((button) => button.addEventListener("click", () => sendQuestion(button.textContent)));

// CMS prototype: settings and uploaded previews stay in the current browser.
const adminShell = $("#adminShell");
function openAdmin() { adminShell.classList.add("open"); document.body.classList.add("no-scroll"); mobileMenu.classList.remove("open"); }
function closeAdmin() { adminShell.classList.remove("open"); document.body.classList.remove("no-scroll"); }
$$('[data-open-admin]').forEach((button) => button.addEventListener("click", openAdmin));
$(".admin-close").addEventListener("click", closeAdmin);
$("#previewSite").addEventListener("click", closeAdmin);
const adminTitles = { overview: "Content overview", hero: "Hero & identity", rooms: "Room catalogue", facilities: "Facilities & services", tour: "360° tour scenes" };
function setAdminTab(name) {
  $$('[data-admin-tab]').forEach((button) => button.classList.toggle("active", button.dataset.adminTab === name));
  $$('[data-admin-page]').forEach((page) => page.classList.toggle("active", page.dataset.adminPage === name));
  $("#adminTitle").textContent = adminTitles[name];
  $(".admin-main").scrollTop = 0;
}
$$('[data-admin-tab]').forEach((button) => button.addEventListener("click", () => setAdminTab(button.dataset.adminTab)));
$$('[data-jump-admin]').forEach((button) => button.addEventListener("click", () => setAdminTab(button.dataset.jumpAdmin)));
function loadImage(file, callback) {
  if (!file || !file.type.startsWith("image/")) return showToast("Please choose a valid image file");
  const reader = new FileReader();
  reader.onload = () => callback(reader.result, file.name);
  reader.readAsDataURL(file);
}
$("#heroUpload").addEventListener("change", (event) => loadImage(event.target.files[0], (src) => { $("#adminHeroPreview").src = src; $("#heroImage").src = src; showToast("Hero preview updated"); }));
$("#heroEditor").addEventListener("submit", (event) => {
  event.preventDefault();
  const text = $("#heroTextInput").value.trim();
  if (text) { $("#heroCopy").textContent = text; localStorage.setItem("gt_hero_copy", text); }
  showToast("Hero content saved in this browser");
});
const savedHeroCopy = localStorage.getItem("gt_hero_copy");
if (savedHeroCopy) { $("#heroCopy").textContent = savedHeroCopy; $("#heroTextInput").value = savedHeroCopy; }

function addTourFile(file) {
  loadImage(file, (src, name) => {
    const label = name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
    const card = document.createElement("article");
    card.innerHTML = `<div><img src="${src}" alt="Uploaded panorama"/><span>360°</span></div><h4>${label}</h4><p>Custom upload · Preview</p><button>Preview</button>`;
    $("button", card).addEventListener("click", () => { closeAdmin(); location.hash = "tour"; setScene(src, label); });
    $("#sceneManager").insertBefore(card, $(".scene-add"));
    const count = Number($("#sceneCount").textContent) + 1;
    $("#sceneCount").textContent = count;
    setScene(src, label);
    showToast("360° scene uploaded and ready to preview");
  });
}
$("#tourUpload").addEventListener("change", (event) => addTourFile(event.target.files[0]));
$("[data-tour-upload]").addEventListener("change", (event) => addTourFile(event.target.files[0]));
$$('[data-set-scene]').forEach((button) => button.addEventListener("click", () => { closeAdmin(); location.hash = "tour"; setScene(button.dataset.setScene, button.closest("article").querySelector("h4").textContent); }));

$("#addRoom").addEventListener("click", () => showToast("New room form ready in prototype flow"));
$("#addFacility").addEventListener("click", () => showToast("New facility form ready in prototype flow"));
$$('[data-edit-row]').forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.editRow} opened for editing`)));

addEventListener("keydown", (event) => {
  if (event.key === "Escape") { mobileMenu.classList.remove("open"); toggleAI(false); }
});
