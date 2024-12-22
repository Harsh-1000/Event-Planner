

const events = [
    {
      title: "Tech Conference 2024",
      date: "2024-12-25T10:00:00",
      location: "Convention Center",
      description: "Annual technology conference featuring industry leaders.",
      countdown: { days: 3, hours: 9, minutes: 47, seconds: 41 }
    },
    {
      title: "Innovation Summit 2024",
      date: "2024-12-30T09:00:00",
      location: "Expo Center",
      description: "Innovation Summit focusing on cutting-edge technologies.",
      countdown: { days: 5, hours: 12, minutes: 25, seconds: 50 }
    },
    {
        title: "Innovation Summit 2024",
        date: "2024-12-30T09:00:00",
        location: "Expo Center",
        description: "Innovation Summit focusing on cutting-edge technologies.",
        countdown: { days: 5, hours: 12, minutes: 25, seconds: 50 }
      }
  ];
  
  // Function to create and append event card to the DOM using template literals
  function renderEvents(events) {
    container = document.getElementById('event-container');
    // Container to hold event cards
    
    events.forEach(event => {
      // Create the event card HTML structure as a string using template literals
      const eventCardHTML = `
        <div class="event-card">
          <!-- Event Details Section -->
          <div class="event-details">
            <h3 class="event-title">${event.title}</h3>
            <p class="event-date">${new Date(event.date).toLocaleString()}</p>
            <p class="event-location"><i>${event.location}</i></p>
            <p class="event-description">${event.description}</p>
  
            <!-- Countdown Section -->
            <div class="event-countdown">
              <div class="time-remaining">
                ⏳ <span class="days">${event.countdown.days}</span> days
                <span class="hours">${event.countdown.hours}</span> hrs
                <span class="minutes">${event.countdown.minutes}</span> min
                <span class="seconds">${event.countdown.seconds}</span> sec
              </div>
            </div>
          </div>
  
          <!-- Action Buttons -->
          <div class="event-actions">
            <button class="edit-btn action-btn">✏️</button>
            <button class="delete-btn action-btn">🗑️</button>
          </div>
        </div>
      `;
      
      // Append the event card to the container
      container.innerHTML += eventCardHTML; 
    });
  }
  
  window.onload = () => {
    renderEvents(events);
  };
  // Call the function to render the events
