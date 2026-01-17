// 1) Grab elements from the page (so we can read inputs and update text)
const materialEl = document.getElementById("material");
const hoursEl = document.getElementById("hours");
const qtyEl = document.getElementById("qty");
const estimateBtn = document.getElementById("estimateBtn");
const resultEl = document.getElementById("result");

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

// 4) Calculate estimate based on the current UI values
function estimatePrice() {
  const material = materialEl.value;      // "PLA" or "PETG"
  const hours = toNumber(hoursEl.value);  // e.g. 2.5
  const qty = Math.max(1, Math.floor(toNumber(qtyEl.value))); // integer >= 1

  // Cost per unit:
  const perUnit = BASE_FEE + (HOURLY_RATE * hours) + (MATERIAL_RATE[material] * hours);

  // Total:
  const total = perUnit * qty;

  // 5) Update the page (DOM)
  resultEl.textContent = `Estimated total: ${total.toFixed(2)} EUR (for ${qty} item(s))`;
}

// 6) When the button is clicked, run the calculation
estimateBtn.addEventListener("click", estimatePrice);

// Optional: update automatically when inputs change (nice UX)
materialEl.addEventListener("change", estimatePrice);
hoursEl.addEventListener("input", estimatePrice);
qtyEl.addEventListener("input", estimatePrice);

// Run once on page load so you see a value immediately
estimatePrice();
