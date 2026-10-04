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
  "Deluxe King": { label: "COUPLES’ FAVOURITE", guests: "2 guests", size: "32 m²", price: "IDR 1,100,000", copy: "A calm, elegant base for two with a king bed, premium linen, private balcony, and mountain or city view." },
  "Premier Twin": { label: "FAMILY & FRIENDS", guests: "2–3 guests", size: "36 m²", price: "IDR 1,450,000", copy: "A flexible stay with two premium beds, generous storage, an air purifier, and a private view balcony." },
  "Premier King": { label: "PANORAMIC COMFORT", guests: "2 guests", size: "38 m²", price: "IDR 1,850,000", copy: "A spacious king room with an elevated view, lounge corner, warm timber details, and seamless five-star comfort." }
};
const roomFacilities = ["Premium king/twin bedding", "Private view balcony", "Large Smart TV", "In-room air purifier", "Modern bathroom", "Complete toiletries", "Tea & coffee maker", "Electronic key card"];
const detailDialog = $("#detailDialog");
function openRoom(name) {
  const room = roomData[name];
  $("#dialogContent").innerHTML = `<p class="eyebrow">${room.label}</p><h2>${name}</h2><p>${room.copy}</p><div class="room-meta"><span>${room.guests}</span><span>${room.size}</span></div><ul>${roomFacilities.map((item) => `<li>✓ ${item}</li>`).join("")}</ul><div class="dialog-price"><span>From</span><strong>${room.price}</strong><small>/night</small></div>`;
  detailDialog.showModal();
}
$$('[data-room]').forEach((button) => button.addEventListener("click", () => openRoom(button.dataset.room)));
$$('.room-tabs button').forEach((button) => button.addEventListener("click", () => {
  $$('.room-tabs button').forEach((item) => item.classList.toggle("active", item === button));
  $$('.room-card').forEach((card) => card.hidden = button.dataset.roomFilter !== "all" && card.dataset.category !== button.dataset.roomFilter);
}));

const facilityData = {
  "Water & Relaxation": ["Indoor heated swimming pool", "Outdoor swimming pool", "Kids pool", "Spa", "Jacuzzi", "Sauna"],
  "Sports & Entertainment": ["Green Maze Garden", "Fitness center", "Billiards", "Table tennis", "Kids Club", "Indoor & outdoor playground", "Electric motorbike rental"],
  "Culinary": ["Skydome Infinite8 Eateria", "Wood-fired pizza", "Cocktails & mocktails", "Live teppanyaki", "The Peak buffet restaurant", "Indonesian and Western breakfast"],
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

const hotelKnowledge = `Golden Tulip Holland Resort Batu is a 5-star resort at Jl. Cherry No. 10 Panderman Hills, Batu, East Java. It has 260 rooms across 7 floors. Rooms: Deluxe King for couples, Premier Twin for friends/family, Premier King. Rates range IDR 1,100,000 to IDR 2,500,000++ per night and vary by date. Room facilities: premium bedding, balcony with mountain or city views, Smart TV, air purifier, modern bathroom, toiletries, tea/coffee maker, electronic key card. Facilities: indoor heated swimming pool, outdoor pool, kids pool, spa, jacuzzi, sauna, Green Maze Garden, gym, billiards, table tennis, Kids Club, playground, electric motorbike rental. Dining: Skydome Infinite8 Eateria and The Peak buffet restaurant. Services: 24-hour reception, room service, concierge, meeting rooms, business center, buggy/car shuttle, parking, free high-speed WiFi. Nearby: Jatim Park 2 760m, Jatim Park 1 850m, BNS 1.3km, Kusuma Agrowisata 1.3km, Batu City Square 2.3km.`;
function localAI(question) {
  const q = question.toLowerCase();
  if (/keluarga|family|anak/.test(q)) return "Untuk keluarga, Premier Twin paling fleksibel. Anda juga bisa menikmati indoor heated pool, kids pool, Kids Club, playground indoor/outdoor, dan Green Maze Garden.";
  if (/kolam|pool|renang|hangat/.test(q)) return "Ya. Resort memiliki indoor heated swimming pool yang nyaman untuk anak, outdoor pool, kids pool, serta jacuzzi dan sauna untuk relaksasi.";
  if (/jatim|jarak|dekat|location/.test(q)) return "Jatim Park 2 berjarak sekitar 760 meter dan Jatim Park 1 sekitar 850 meter. BNS dan Kusuma Agrowisata sekitar 1,3 km dari hotel.";
  if (/harga|rate|price|berapa/.test(q)) return "Harga kamar mulai sekitar IDR 1.100.000 hingga IDR 2.500.000++ per malam. Tarif dapat berubah pada akhir pekan dan high season.";
  if (/makan|restoran|food|breakfast|sarapan/.test(q)) return "The Peak menyediakan buffet breakfast Indonesia dan Western. Untuk pengalaman spesial, Skydome Infinite8 menyajikan wood-fired pizza, mocktail/cocktail, dan live teppanyaki dengan panorama kota dan gunung.";
  return "Tentu. Saya bisa membantu tentang tipe kamar, harga, fasilitas, restoran, tur 360°, atau akses ke tempat wisata di Batu. Apa yang paling ingin Anda ketahui?";
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
const adminTitles = { overview: "Content overview", hero: "Hero & identity", rooms: "Room catalogue", facilities: "Facilities & services", tour: "360° tour scenes", ai: "GT AI settings" };
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

$("#aiSettings").addEventListener("submit", (event) => {
  event.preventDefault();
  const key = $("#geminiKey").value.trim();
  if (key) sessionStorage.setItem("gt_gemini_key", key); else sessionStorage.removeItem("gt_gemini_key");
  sessionStorage.setItem("gt_gemini_model", $("#geminiModel").value);
  const welcome = $("#welcomeMessage").value.trim();
  if (welcome) $$('.message.bot', $("#aiMessages"))[0].textContent = welcome;
  $("#aiStatus").textContent = key ? "Gemini connected" : "Demo mode";
  showToast(key ? "Gemini connected for this session" : "GT AI saved in demo mode");
});
$("#aiStatus").textContent = sessionStorage.getItem("gt_gemini_key") ? "Gemini connected" : "Demo mode";
$("#geminiKey").value = sessionStorage.getItem("gt_gemini_key") || "";

$("#addRoom").addEventListener("click", () => showToast("New room form ready in prototype flow"));
$("#addFacility").addEventListener("click", () => showToast("New facility form ready in prototype flow"));
$$('[data-edit-row]').forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.editRow} opened for editing`)));

addEventListener("keydown", (event) => {
  if (event.key === "Escape") { mobileMenu.classList.remove("open"); toggleAI(false); }
});
