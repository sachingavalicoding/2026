/* ------------------ DOM ------------------ */
const header = document.querySelector(".header");
const body = document.querySelector(".body");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const currentPeriod = document.querySelector(".currentPeriod");
/* ------------------ DATA ------------------ */
let assets = [
  {
    id: "asset_001",
    name: "JCB 3DX Backhoe Loader",
    bookings: [
      { fromDate: "01-01-2026", toDate: "10-01-2026" },
      { fromDate: "21-01-2026", toDate: "30-01-2026" },
    ],
  },
  {
    id: "asset_002",
    name: "Tata Hitachi ZX200 Excavator",
    bookings: [{ fromDate: "05-01-2026", toDate: "12-01-2026" }],
  },
];

/* ------------------ STATE ------------------ */
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

const startCellMap = {}; // assetIndex → start cell
const selectedCells = {}; // assetIndex → Set(days)
let isShiftPressed = false;
let isCtrlPressed = false;

/* ------------------ INIT ------------------ */
renderDateHeader();
renderHeader();
renderBody();

/* ------------------ EVENTS ------------------ */
prev.addEventListener("click", () => {
  changeMonth(-1);
  rerender();
});

next.addEventListener("click", () => {
  changeMonth(1);
  rerender();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Shift") isShiftPressed = true;
  if (e.key === "Control") isCtrlPressed = true;
});

document.addEventListener("keyup", (e) => {
  if (e.key === "Shift") isShiftPressed = false;
  if (e.key === "Control") isCtrlPressed = false;
});

/* ------------------ FUNCTIONS ------------------ */

function rerender() {
  renderDateHeader();
  renderHeader();
  renderBody();
}
function getSelectionKey() {
  return `${currentYear}-${currentMonth}`;
}

function changeMonth(value) {
  currentMonth += value;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
}

function getTotalDays(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function renderDateHeader() {
  currentPeriod.textContent = `${currentMonth + 1} - ${currentYear}`;
}

/* ------------------ HEADER ------------------ */
function renderHeader() {
  header.innerHTML = "";

  const title = document.createElement("div");
  title.className = "headerTitle";
  title.textContent = "Assets";
  header.appendChild(title);

  const row = document.createElement("div");
  row.className = "headerRow";

  const totalDays = getTotalDays(currentMonth, currentYear);
  for (let d = 1; d <= totalDays; d++) {
    const cell = document.createElement("div");
    cell.className = "header-cell";
    cell.textContent = d;
    row.appendChild(cell);
  }

  header.appendChild(row);
}

/* ------------------ BODY ------------------ */
function renderBody() {
  body.innerHTML = "";

  assets.forEach((asset, assetIndex) => {
    const row = document.createElement("div");
    row.className = "asset-row";

    const title = document.createElement("div");
    title.className = "asset-title";
    title.textContent = asset.name;
    row.appendChild(title);

    const totalDays = getTotalDays(currentMonth, currentYear);

    for (let day = 1; day <= totalDays; day++) {
      const cell = document.createElement("span");
      cell.className = "cell";
      cell.dataset.asset = assetIndex;
      cell.dataset.col = day - 1;

      if (isBooked(day, currentMonth, currentYear, asset.bookings)) {
        cell.classList.add("booked");
      }

      if (selectedCells[assetIndex]?.has(day - 1)) {
        cell.classList.add("selected");
      }

      cell.addEventListener("click", () => handleCellClick(cell));
      row.appendChild(cell);
    }

    body.appendChild(row);
  });
}

/* ------------------ SELECTION LOGIC ------------------ */

function handleCellClick(cell) {
  if (cell.classList.contains("booked")) return;

  const asset = cell.dataset.asset;
  const col = +cell.dataset.col;
  const key = getSelectionKey();

  if (!selectedCells[key]) selectedCells[key] = {};
  if (!selectedCells[key][asset]) selectedCells[key][asset] = new Set();

  // Normal click
  // if (!isShiftPressed) {
  //   clearSelectionForAsset(asset);
  //   selectedCells[key][asset].clear();
  //   startCellMap[asset] = cell;
  //   selectedCells[key][asset].add(col);
  //   cell.classList.add("selected");
  //   return;
  // }

  // Shift start
  if (isShiftPressed && !startCellMap[asset]) {
    startCellMap[asset] = cell;
    selectedCells[key][asset].add(col);
    cell.classList.add("selected");
    return;
  }

  // Shift add
  if (isShiftPressed && !isCtrlPressed) {
    applyRange(startCellMap[asset], cell, "add");
  }

  // Ctrl + Shift remove
  if (isShiftPressed && isCtrlPressed) {
    applyRange(startCellMap[asset], cell, "remove");
  }
}

function applyRange(start, end, mode) {
  const asset = start.dataset.asset;
  const sc = +start.dataset.col;
  const ec = +end.dataset.col;
  const min = Math.min(sc, ec);
  const max = Math.max(sc, ec);
  const key = getSelectionKey();

  if (!selectedCells[key]) selectedCells[key] = {};
  if (!selectedCells[key][asset]) selectedCells[key][asset] = new Set();

  for (let c = min; c <= max; c++) {
    const cell = document.querySelector(
      `.cell[data-asset="${asset}"][data-col="${c}"]`
    );
    if (!cell || cell.classList.contains("booked")) continue;

    if (mode === "add") {
      cell.classList.add("selected");
      selectedCells[key][asset].add(c);
    } else {
      cell.classList.remove("selected");
      selectedCells[key][asset].delete(c);
    }
  }
}

const key = getSelectionKey();
if (selectedCells[key]?.[assetIndex]?.has(day - 1)) {
  cell.classList.add("selected");
}
function saveSelection() {
  const result = [];

  for (let key in selectedCells) {
    const [year, month] = key.split("-").map(Number);

    const assetsSelection = selectedCells[key];
    for (let assetIndex in assetsSelection) {
      const days = Array.from(assetsSelection[assetIndex]).sort(
        (a, b) => a - b
      );
      if (days.length === 0) continue;

      let ranges = [];
      let start = days[0],
        end = days[0];

      for (let i = 1; i < days.length; i++) {
        if (days[i] === end + 1) {
          end = days[i];
        } else {
          ranges.push({
            fromDate: new Date(year, month, start + 1),
            toDate: new Date(year, month, end + 1),
          });
          start = end = days[i];
        }
      }
      ranges.push({
        fromDate: new Date(year, month, start + 1),
        toDate: new Date(year, month, end + 1),
      });

      result.push({
        assetId: assets[assetIndex].id,
        ranges: ranges.map((r) => ({
          fromDate: formatDate(r.fromDate),
          toDate: formatDate(r.toDate),
        })),
      });
    }
  }

  console.log("Final selection to save:", result);
  return result; // store this in DB
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}
const saveBtn = document.createElement("button");
saveBtn.textContent = "Save Selection";
saveBtn.addEventListener("click", saveSelection);
document.body.appendChild(saveBtn);

function clearSelectionForAsset(asset) {
  document
    .querySelectorAll(`.cell[data-asset="${asset}"].selected`)
    .forEach((c) => c.classList.remove("selected"));
  selectedCells[asset]?.clear();
}

/* ------------------ BOOKINGS ------------------ */
function isBooked(day, month, year, bookings) {
  const date = new Date(year, month, day);
  return bookings.some((b) => {
    const from = parseDate(b.fromDate);
    const to = parseDate(b.toDate);
    return from <= date && date <= to;
  });
}

function parseDate(str) {
  const [dd, mm, yy] = str.split("-");
  return new Date(yy, mm - 1, dd);
}

/* ------------------ DEBUG SAVE DATA ------------------ */
window.getSavedSelection = () => {
  return Object.entries(selectedCells).map(([i, set]) => ({
    assetId: assets[i].id,
    days: [...set].map((d) => d + 1),
    month: currentMonth + 1,
    year: currentYear,
  }));
};
