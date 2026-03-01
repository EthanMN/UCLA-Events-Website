// Replace this with your full merged UCLA events JSON
// const allEvents = [
//   {
//     "title": "UCLA vs Nebraska",
//     "category": "Basketball (M)",
//     "homeAway": "Home",
//     "date": "2026-03-03",
//     "time": "8:00 PM",
//     "location": "Pauley Pavilion",
//     "link": "https://ucla.evenue.net/cgi-bin/ncommerce3/SEGetEventInfo?ticketCode=GS:MULTI:MBB25:219:&linkID=ucla-multi&dataAccId=930&locale=en_US&siteId=ev_ucla-multi&RSRC=Email&RDAT=4567"
//   }
//   // add the rest of your JSON here
// ];

let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let allEventsGlobal = [];

const files = [
  "../scheduleData/baseball.json",
  "../scheduleData/softball.json",
  "../scheduleData/othersports.json"
];

// Load all events
Promise.all(files.map(file => fetch(file).then(res => res.json())))
  .then(dataArrays => {
    allEventsGlobal = dataArrays.flat();
    allEventsGlobal.sort((a,b) => new Date(a.date) - new Date(b.date));
    renderCalendar(allEventsGlobal);
  })
  .catch(err => console.error("Error loading events:", err));

function renderCalendar(events) {
  const calendarGrid = document.getElementById("calendar-grid");
  calendarGrid.innerHTML = "";

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Empty cells before first day
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

  // Header
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

