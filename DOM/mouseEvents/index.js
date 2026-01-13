const calendar = document.getElementById("calendar");
const days = [...document.querySelectorAll(".day")];

let isDragging = false;
let startIndex = null;

calendar.addEventListener("mousedown", (e) => {
  if (!e.target.classList.contains("day")) return;

  isDragging = true;
  startIndex = days.indexOf(e.target);

  clearSelection();
  e.target.classList.add("start", "selected");
});

calendar.addEventListener("mousemove", (e) => {
  if (!isDragging || !e.target.classList.contains("day")) return;

  const currentIndex = days.indexOf(e.target);
  highlightRange(startIndex, currentIndex);
});

document.addEventListener("mouseup", () => {
  isDragging = false;
});

function highlightRange(start, end) {
  clearSelection();

  const from = Math.min(start, end);
  const to = Math.max(start, end);

  days.forEach((day, index) => {
    if (index >= from && index <= to) {
      day.classList.add("selected");
    }
  });

  days[start].classList.add("start");
  days[end].classList.add("end");
}

function clearSelection() {
  days.forEach((day) => day.classList.remove("selected", "start", "end"));
}
