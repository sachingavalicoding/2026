const vehicles = [
  { id: 1, name: "JCB 3DX Backhoe Loader", registration: "MH-12-AB-1234" },
  {
    id: 2,
    name: "Tata Hitachi ZX200 Excavator",
    registration: "MH-12-CD-5678",
  },
  { id: 3, name: "Mahindra Earth Master", registration: "MH-12-EF-9012" },
  { id: 4, name: "JCB JS130 Excavator", registration: "MH-12-GH-3456" },
  { id: 5, name: "CAT 320D Excavator", registration: "MH-12-IJ-7890" },
  { id: 6, name: "Hyundai R140 Excavator", registration: "MH-12-KL-2345" },
  { id: 7, name: "JCB 3CX Super", registration: "MH-12-MN-6789" },
  { id: 8, name: "Volvo EC140D Excavator", registration: "MH-12-OP-0123" },
];

let currentMonth = 0;
let currentYear = 2025;
let rentals = {};
let isSelecting = false;
let selectionStart = null;
let tempSelection = {};
let selectionMode = "add";
let searchTerm = "";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function getDayName(date, month, year) {
  const d = new Date(year, month, date);
  return dayNames[d.getDay()];
}

function isWeekend(date, month, year) {
  const d = new Date(year, month, date);
  return d.getDay() === 0 || d.getDay() === 6;
}

function getCellKey(vehicleId, date) {
  return `${vehicleId}-${currentYear}-${currentMonth}-${date}`;
}

function getRentalDays(vehicleId) {
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  let days = 0;
  for (let d = 1; d <= daysInMonth; d++) {
    if (rentals[getCellKey(vehicleId, d)]) days++;
  }
  return days;
}

function updateMonthDisplay() {
  document.getElementById(
    "currentMonth"
  ).textContent = `${months[currentMonth]} ${currentYear}`;
}

function prevMonth() {
  if (currentMonth === 0) {
    currentMonth = 11;
    currentYear--;
  } else {
    currentMonth--;
  }
  renderCalendar();
}

function nextMonth() {
  if (currentMonth === 11) {
    currentMonth = 0;
    currentYear++;
  } else {
    currentMonth++;
  }
  renderCalendar();
}

function handleMouseDown(vehicleId, date, e) {
  e.preventDefault();
  const key = getCellKey(vehicleId, date);
  const isCurrentlyRented = rentals[key];

  isSelecting = true;
  selectionStart = { vehicleId, date };
  selectionMode = isCurrentlyRented ? "remove" : "add";
  tempSelection = { [key]: !isCurrentlyRented };

  updateCellDisplay(vehicleId, date);
}

function handleMouseEnter(vehicleId, date) {
  if (isSelecting && selectionStart && selectionStart.vehicleId === vehicleId) {
    const start = Math.min(selectionStart.date, date);
    const end = Math.max(selectionStart.date, date);

    tempSelection = {};
    for (let d = start; d <= end; d++) {
      const key = getCellKey(vehicleId, d);
      if (selectionMode === "add") {
        tempSelection[key] = true;
      } else {
        tempSelection[key] = false;
      }
    }

    renderCalendar();
  }
}

function handleMouseUp() {
  if (isSelecting && Object.keys(tempSelection).length > 0) {
    Object.keys(tempSelection).forEach((key) => {
      if (selectionMode === "add") {
        rentals[key] = true;
      } else {
        delete rentals[key];
      }
    });
  }
  isSelecting = false;
  selectionStart = null;
  tempSelection = {};
  renderCalendar();
}

function updateCellDisplay(vehicleId, date) {
  const key = getCellKey(vehicleId, date);
  const cell = document.querySelector(`[data-cell="${key}"]`);
  if (cell) {
    updateCellClass(cell, key);
  }
}

function updateCellClass(cell, key) {
  const isRented = rentals[key];
  const isTempSelected = tempSelection.hasOwnProperty(key);

  cell.className = "calendar-cell";

  if (isTempSelected) {
    if (selectionMode === "remove") {
      cell.classList.add("temp-remove");
    } else {
      cell.classList.add("temp-add");
    }
  } else if (isRented) {
    cell.classList.add("booked");
  }
}

function getFilteredVehicles() {
  return vehicles.filter(
    (v) =>
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.registration.toLowerCase().includes(searchTerm.toLowerCase())
  );
}

function renderCalendar() {
  updateMonthDisplay();
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const filteredVehicles = getFilteredVehicles();

  // Render header
  let headerHTML = "<tr>";
  headerHTML += "<th>Equipment</th>";

  for (let d = 1; d <= daysInMonth; d++) {
    const weekend = isWeekend(d, currentMonth, currentYear);
    headerHTML += `<th class="day-header ${weekend ? "weekend" : ""}">
          <span class="day-name">${getDayName(
            d,
            currentMonth,
            currentYear
          )}</span>
          <span class="day-number">${d}</span>
        </th>`;
  }

  headerHTML += "<th>Days Booked</th>";
  headerHTML += "</tr>";
  document.getElementById("tableHead").innerHTML = headerHTML;

  // Render body
  let bodyHTML = "";
  filteredVehicles.forEach((vehicle) => {
    bodyHTML += "<tr>";
    bodyHTML += `<td>
          <div class="vehicle-info">
            <span class="vehicle-name">${vehicle.name}</span>
            <span class="vehicle-reg">${vehicle.registration}</span>
          </div>
        </td>`;

    for (let d = 1; d <= daysInMonth; d++) {
      const key = getCellKey(vehicle.id, d);
      const isRented = rentals[key];
      const isTempSelected = tempSelection.hasOwnProperty(key);
      const showAsRented = isTempSelected ? tempSelection[key] : isRented;
      const weekend = isWeekend(d, currentMonth, currentYear);

      let cellClass = "calendar-cell";
      if (isTempSelected) {
        cellClass += selectionMode === "remove" ? " temp-remove" : " temp-add";
      } else if (showAsRented) {
        cellClass += " booked";
      }

      bodyHTML += `<td class="${weekend ? "weekend" : ""}">
            <div class="${cellClass}" 
                 data-cell="${key}"
                 onmousedown="handleMouseDown(${vehicle.id}, ${d}, event)"
                 onmouseenter="handleMouseEnter(${vehicle.id}, ${d})">
            </div>
          </td>`;
    }

    const rentalDays = getRentalDays(vehicle.id);
    bodyHTML += `<td><span class="days-count">${rentalDays}</span></td>`;
    bodyHTML += "</tr>";
  });

  document.getElementById("tableBody").innerHTML = bodyHTML;
}

function exportData() {
  let csvContent = "Vehicle,Registration,";
  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  for (let d = 1; d <= daysInMonth; d++) {
    csvContent += `${d},`;
  }
  csvContent += "Total Days\n";

  vehicles.forEach((vehicle) => {
    csvContent += `"${vehicle.name}","${vehicle.registration}",`;
    for (let d = 1; d <= daysInMonth; d++) {
      const key = getCellKey(vehicle.id, d);
      csvContent += rentals[key] ? "X," : ",";
    }
    csvContent += `${getRentalDays(vehicle.id)}\n`;
  });

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `vehicle-rental-${months[currentMonth]}-${currentYear}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

document.addEventListener("mouseup", handleMouseUp);

document.getElementById("searchInput").addEventListener("input", (e) => {
  searchTerm = e.target.value;
  renderCalendar();
});

renderCalendar();
