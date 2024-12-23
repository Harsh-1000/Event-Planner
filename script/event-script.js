

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



  function updateEventForm(i, event) {
    const formContainer = document.createElement('form');
    formContainer.id = `event-form-${i}`;

    formContainer.innerHTML = `
        <div class="form-container">
            <div class="add-event-form form-left">
                <div class="form-header">
                    <img src="./img/add-event.png" alt="+" class="input-title-img">
                    <h2 class="card-title">New Event</h2>
                </div>
            
                <div class="form-field">
                    <label for="event-name-${i}">Event Name</label>
                    <input type="text" name="event-name-${i}" id="event-name-${i}" placeholder="Enter Event Name" value="${event.eventName}">
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label for="event-date-${i}">Date</label>
                        <input type="date" id="event-date-${i}" name="event-date-${i}" value="${event.eventDate}">
                    </div>
    
                    <div class="form-field">
                        <label for="event-time-${i}">Time</label>
                        <input type="time" id="event-time-${i}" name="event-time-${i}" value="${event.eventTime}">
                    </div>
                </div>
    
                <div class="form-field">
                    <label for="event-location-${i}">Location</label>
                    <input type="text" id="event-location-${i}" name="event-location-${i}" placeholder="Enter location" value="${event.eventLocation}">
                </div>
    
                <div class="form-field">
                    <label for="event-desrcp-${i}">Description</label>
                    <textarea name="event-desrcp-${i}" id="event-desrcp-${i}" placeholder="Enter event description">${event.eventDescription}</textarea>
                </div>        
            </div>
    
            <div class="add-event-form form-right">
                <div class="form-header">
                    <img src="./img/recurrent.png" alt="recurrence" class="input-title-img">
                    <h3 for="event-recur-${i}">Recurring Event</h3>
                    <label class="switch">
                        <input name="is-recurrence-${i}" type="checkbox">
                        <span class="slider round"></span>
                    </label>
                </div>
    
                <div class="radio-field">
                    <div class="radio-item">
                        <input type="radio" id="daily-${i}" name="recurrence-${i}" value="daily">
                        <label for="daily-${i}">Daily</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="weekly-${i}" name="recurrence-${i}" value="weekly">
                        <label for="weekly-${i}">Weekly</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="monthly-${i}" name="recurrence-${i}" value="monthly">
                        <label for="monthly-${i}">Monthly</label>
                    </div>
                    <div class="radio-item">
                        <input type="radio" id="custom-${i}" name="recurrence-${i}" value="custom">
                        <label for="custom-${i}">Custom</label>
                    </div>
                </div>
    
                <div class="form-grid">
                    <div class="form-field">
                        <label for="event-repeat-date-${i}">Repeat Until</label>
                        <input type="date" id="event-repeat-date-${i}" name="repeat-until-${i}">
                    </div>
                    <div class="form-field">
                        <label for="event-frequency-${i}">Frequency</label>
                        <select name="event-frequency-${i}" id="event-frequency-${i}">
                            <option value="">Select...</option>
                            <option value="1">Every time</option>
                            <option value="2">Every 2nd time</option>
                            <option value="3">Every 3rd time</option>
                            <option value="4">Every 4th time</option>
                        </select>
                    </div>
                </div>
    
                <div class="form-field">
                    <label for="event-category-${i}">Category</label>
                    <select id="event-category-${i}" name="event-category-${i}">
                        <option value="">Select a category</option>
                        <option value="conference">Conference</option>
                        <option value="workshop">Workshop</option>
                        <option value="seminar">Seminar</option>
                        <option value="webinar">Webinar</option>
                        <option value="meetup">Meetup</option>
                        <option value="party">Party</option>
                        <option value="other">Other</option>
                    </select>
                </div>
            </div>
        </div>
        <div class="btn-container">
            <button type="submit" class="form-btn primary-btn" >Create Event</button>
            <button type="reset" class="form-btn secondary-btn">Clear Form</button>
        </div>
    `;

    return formContainer;
}

function openUpdateEventForm(i) {
    const event = events[i];
    const formContainer = updateEventForm(i, event);
    const eventCard = document.querySelectorAll('.event-card')[i];

    eventCard.replaceWith(formContainer);
    
    const form = formContainer.querySelector('form');
    
    form.onsubmit = function (e) {
        e.preventDefault(); 

        const updatedEvent = {
            eventName: document.getElementById(`event-name-${i}`).value,
            eventDate: document.getElementById(`event-date-${i}`).value,
            eventTime: document.getElementById(`event-time-${i}`).value,
            eventLocation: document.getElementById(`event-location-${i}`).value,
            eventDescription: document.getElementById(`event-desrcp-${i}`).value,
            eventRecurrence: document.querySelector(`input[name="recurrence-${i}"]:checked`)?.value,
            eventCategory: document.getElementById(`event-category-${i}`).value,
        };
        events[i] = updatedEvent;
        showEvents();
    };
}

// -----------
function updateEventForm(i, event) {
  const formContainer = document.createElement('form');
  formContainer.id = `event-form-${i}`;

  formContainer.innerHTML = `
      <div class="form-container">
          <div class="add-event-form form-left">
              <div class="form-header">
                  <img src="./img/add-event.png" alt="+" class="input-title-img">
                  <h2 class="card-title">New Event</h2>
              </div>
          
              <div class="form-field">
                  <label for="event-name-${i}">Event Name</label>
                  <input type="text" name="event-name-${i}" id="event-name-${i}" placeholder="Enter Event Name" value="${event.eventName}">
              </div>
              <div class="form-grid">
                  <div class="form-field">
                      <label for="event-date-${i}">Date</label>
                      <input type="date" id="event-date-${i}" name="event-date-${i}" value="${event.eventDate}">
                  </div>
  
                  <div class="form-field">
                      <label for="event-time-${i}">Time</label>
                      <input type="time" id="event-time-${i}" name="event-time-${i}" value="${event.eventTime}">
                  </div>
              </div>
  
              <div class="form-field">
                  <label for="event-location-${i}">Location</label>
                  <input type="text" id="event-location-${i}" name="event-location-${i}" placeholder="Enter location" value="${event.eventLocation}">
              </div>
  
              <div class="form-field">
                  <label for="event-desrcp-${i}">Description</label>
                  <textarea name="event-desrcp-${i}" id="event-desrcp-${i}" placeholder="Enter event description">${event.eventDescription}</textarea>
              </div>        
          </div>
  
          <div class="add-event-form form-right">
              <div class="form-header">
                  <img src="./img/recurrent.png" alt="recurrence" class="input-title-img">
                  <h3 for="event-recur-${i}">Recurring Event</h3>
                  <label class="switch">
                      <input name="is-recurrence-${i}" type="checkbox">
                      <span class="slider round"></span>
                  </label>
              </div>
  
              <div class="radio-field">
                  <div class="radio-item">
                      <input type="radio" id="daily-${i}" name="recurrence-${i}" value="daily">
                      <label for="daily-${i}">Daily</label>
                  </div>
                  <div class="radio-item">
                      <input type="radio" id="weekly-${i}" name="recurrence-${i}" value="weekly">
                      <label for="weekly-${i}">Weekly</label>
                  </div>
                  <div class="radio-item">
                      <input type="radio" id="monthly-${i}" name="recurrence-${i}" value="monthly">
                      <label for="monthly-${i}">Monthly</label>
                  </div>
                  <div class="radio-item">
                      <input type="radio" id="custom-${i}" name="recurrence-${i}" value="custom">
                      <label for="custom-${i}">Custom</label>
                  </div>
              </div>
  
              <div class="form-grid">
                  <div class="form-field">
                      <label for="event-repeat-date-${i}">Repeat Until</label>
                      <input type="date" id="event-repeat-date-${i}" name="repeat-until-${i}">
                  </div>
                  <div class="form-field">
                      <label for="event-frequency-${i}">Frequency</label>
                      <select name="event-frequency-${i}" id="event-frequency-${i}">
                          <option value="">Select...</option>
                          <option value="1">Every time</option>
                          <option value="2">Every 2nd time</option>
                          <option value="3">Every 3rd time</option>
                          <option value="4">Every 4th time</option>
                      </select>
                  </div>
              </div>
  
              <div class="form-field">
                  <label for="event-category-${i}">Category</label>
                  <select id="event-category-${i}" name="event-category-${i}">
                      <option value="">Select a category</option>
                      <option value="conference">Conference</option>
                      <option value="workshop">Workshop</option>
                      <option value="seminar">Seminar</option>
                      <option value="webinar">Webinar</option>
                      <option value="meetup">Meetup</option>
                      <option value="party">Party</option>
                      <option value="other">Other</option>
                  </select>
              </div>
          </div>
      </div>
      <div class="btn-container">
          <button type="submit" class="form-btn primary-btn" >Create Event</button>
          <button type="reset" class="form-btn secondary-btn">Clear Form</button>
      </div>
  `;

  return formContainer;
}

// Global variable to track the current open form
let openFormId = null; 

// Function to handle opening and closing of event forms
function openUpdateEventForm(i) {
  // Check if any form is already open, if so, close it first
  if (openFormId !== null) {
      const openFormContainer = document.getElementById(`event-form-${openFormId}`);
      const openEventCard = document.getElementById(`event-card-${openFormId}`);
      if (openFormContainer && openEventCard) {
          openFormContainer.replaceWith(openEventCard); // Replace form with event card
      }
  }

  // Get the event for the current index
  const event = events[i];
  const formContainer = updateEventForm(i, event);

  // Replace the event card with the form for the selected event
  const eventCard = document.getElementById(`event-card-${i}`);
  eventCard.replaceWith(formContainer);

  // Mark the form as open
  openFormId = i; // Set openFormId to the current event index

  // Handle form submission
  const form = formContainer.querySelector('form');
  form.onsubmit = function (e) {
      e.preventDefault();

      // Get the updated event data
      const updatedEvent = {
          eventName: document.getElementById(`event-name-${i}`).value,
          eventDate: document.getElementById(`event-date-${i}`).value,
          eventTime: document.getElementById(`event-time-${i}`).value,
          eventLocation: document.getElementById(`event-location-${i}`).value,
          eventDescription: document.getElementById(`event-desrcp-${i}`).value,
          eventRecurrence: document.querySelector(`input[name="recurrence-${i}"]:checked`)?.value,
          eventCategory: document.getElementById(`event-category-${i}`).value,
      };

      // Update the event in the array
      events[i] = updatedEvent;

      // Re-render the events
      showEvents();

      // Reset open form tracker
      openFormId = null;
  };
}