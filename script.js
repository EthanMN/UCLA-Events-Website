const files = [
  "data/basketball.json",
  "data/baseball.json",
  "data/softball.json",
  "data/volleyball.json"
];

Promise.all(files.map(file => fetch(file).then(res => res.json())))
  .then(dataArrays => {
    
    // dataArrays = [basketballArray, baseballArray, ...]
    
    const allEvents = dataArrays.flat(); // merge into one array

    // Optional: sort by date
    allEvents.sort((a, b) => new Date(a.date) - new Date(b.date));

    displayEvents(allEvents);
  })
  .catch(error => {
    console.error("Error loading event data:", error);
  });