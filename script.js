// 1) Grab elements from the page (so we can read inputs and update text)
const materialEl = document.getElementById("material");
const hoursEl = document.getElementById("hours");
const qtyEl = document.getElementById("qty");
const estimateBtn = document.getElementById("estimateBtn");
const resultEl = document.getElementById("result");
const rushEl = document.getElementById("rush");
const finishEl = document.getElementById("finish");

// 2) Pricing rules (simple, adjustable constants)
const BASE_FEE = 10;        // fixed fee (setup, machine time, handling)
const HOURLY_RATE = 8;      // labor/machine rate per hour

// material cost per hour (rough proxy: filament + wear)
const MATERIAL_RATE = {
  PLA: 2.0,
  PETG: 2.6,
};

// 3) Helper: safely convert a string input to a number
function toNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function estimatePrice() {
  const material = materialEl.value;
  const hours = toNumber(hoursEl.value);
  const qty = Math.max(1, Math.floor(toNumber(qtyEl.value)));

  const rush = rushEl.checked;     // true/false
  const finish = finishEl.checked; // true/false

  const perUnit = BASE_FEE + (HOURLY_RATE * hours) + (MATERIAL_RATE[material] * hours);

  // Finishing is per item
  const finishingFee = finish ? 5 : 0;

  let subtotal = (perUnit + finishingFee) * qty;

  // Quantity discount (simple example)
  // 5+ items: 10% off, 10+ items: 15% off
  let discountRate = 0;
  if (qty >= 10) discountRate = 0.15;
  else if (qty >= 5) discountRate = 0.10;

  subtotal = subtotal * (1 - discountRate);

  // Rush markup (after discount, common approach)
  if (rush) subtotal = subtotal * 1.25;

  // Minimum order total
  const MIN_TOTAL = 15;
  const total = Math.max(MIN_TOTAL, subtotal);

  // Build a clear output
  const parts = [];
  if (discountRate > 0) parts.push(`discount ${(discountRate * 100).toFixed(0)}%`);
  if (rush) parts.push("rush +25%");
  if (finish) parts.push("finishing +€5/item");
  const notes = parts.length ? ` (${parts.join(", ")})` : "";

  resultEl.textContent = `Estimated total: €${total.toFixed(2)} for ${qty} item(s)${notes}`;
}

// 6) When the button is clicked, run the calculation
estimateBtn.addEventListener("click", estimatePrice);

// Optional: update automatically when inputs change (nice UX)
materialEl.addEventListener("change", estimatePrice);
hoursEl.addEventListener("input", estimatePrice);
qtyEl.addEventListener("input", estimatePrice);

// Run once on page load so you see a value immediately
estimatePrice();
