let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let allEventsGlobal = [];

const files = [
  "../scheduleData/baseball.json",
  "../scheduleData/softball.json",
  "../scheduleData/othersports.json"
];


function renderCalendar(events) {
  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

 
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    calendarGrid.appendChild(emptyCell);
  }

  // Days
  for (let day = 1; day <= lastDate; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day-cell");

    const dayNumber = document.createElement("div");
    dayNumber.classList.add("day-number");
    dayNumber.textContent = day;
    dayCell.appendChild(dayNumber);

    const dayStr = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
    const dayEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setDate(eventDate.getDate() + 1); // Adjust for timezone issues
      const eventStr = `${eventDate.getFullYear()}-${String(eventDate.getMonth()+1).padStart(2,"0")}-${String(eventDate.getDate()).padStart(2,"0")}`;
      return eventStr === dayStr;
    });

    dayEvents.forEach(event => {
      const link = document.createElement("a");
      link.classList.add("event");
      link.classList.add(event.category.replace(/[^a-zA-Z0-9]/g,""));
      link.href = event.link;
      link.target = "_blank";
      link.textContent = `${event.category}: ${event.title} (${event.time})`;
      dayCell.appendChild(link);
    });

    calendarGrid.appendChild(dayCell);
  }

 
  const monthYear = document.getElementById("month-year");
  const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  monthYear.textContent = `${monthNames[currentMonth]} ${currentYear}`;
}

// Navigation
document.getElementById("prev-month").addEventListener("click", () => {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar(allEventsGlobal);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar(allEventsGlobal);
});
function populateSportFilter(events) {
  const sportSelect = document.getElementById("sportFilter");
  const categories = [...new Set(events.map(e => e.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    sportSelect.appendChild(option);
  });
}

function applyFilters() {
  const homeAwayValue = document.getElementById("homeAwayFilter").value;
  const sportValue = document.getElementById("sportFilter").value;

  let filteredEvents = allEventsGlobal;

  if (homeAwayValue !== "all") {
    filteredEvents = filteredEvents.filter(e => e.homeAway === homeAwayValue);
  }

  if (sportValue !== "all") {
    filteredEvents = filteredEvents.filter(e => e.category === sportValue);
  }

  renderCalendar(filteredEvents);
}


document.getElementById("homeAwayFilter").addEventListener("change", applyFilters);
document.getElementById("sportFilter").addEventListener("change", applyFilters);


Promise.all(files.map(file => fetch(file).then(res => res.json())))
  .then(dataArrays => {
    allEventsGlobal = dataArrays.flat();
    allEventsGlobal.sort((a, b) => {
    const dateA = new Date(`${a.date} ${a.time}`);
    const dateB = new Date(`${b.date} ${b.time}`);
    return dateA - dateB;
});
    populateSportFilter(allEventsGlobal);
    renderCalendar(allEventsGlobal);
  })
  .catch(console.error);