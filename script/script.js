function Event(eventName, eventDate, eventTime, eventLocation, eventDescription, eventRecurring, recurrenceType, repeatUntil, frequency, category) 
{
    this.eventName = eventName || '';
    this.eventDate = eventDate || ''; 
    this.eventTime = eventTime || ''; 
    this.eventLocation = eventLocation || ''; 
    this.eventDescription = eventDescription || ''; 
    this.eventRecurring = eventRecurring || false; 
    this.recurrenceType = recurrenceType || null; 
    this.repeatUntil = repeatUntil || ''; 
    this.frequency = frequency || ''; 
    this.category = category || ''; 
    this.hasShown = {
        "5 minutes left": false,
        "30 minutes left": false,
        "1 hour left": false,
        "Started :)": false
    };
}

const form = document.getElementById('event-form');
var events = [];
var openFormId = null; 

window.onload = ()=>{
    events = getStoredEvents();
    showEvents();
    checkUpcomingEvents();
}

window.addEventListener('beforeunload', () => {
    saveEventsToLocalStorage(events);
})

document.querySelector('.search-bar input').addEventListener('input', showEvents);
document.querySelector('.filter-group input[type=date]').addEventListener('change', showEvents);
document.getElementById('filter-category').addEventListener('change', showEvents);
document.getElementById('sort-criteria').addEventListener('change', showEvents);
document.getElementById('sort-order').addEventListener('change', showEvents);
document.querySelector('.clear-filters').addEventListener('click',clearFilter);

setInterval(checkUpcomingEvents, 1* 1000); 

function getStoredEvents() {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
}

function saveEventsToLocalStorage(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    addNewEvent();
});

function addNewEvent()
{
    const formData = new FormData(form);

    if(!validateForm(formData)){
        return;
    }
    
    const eventName = formData.get('event-name');
    const eventDate = formData.get('event-date');
    const eventTime = formData.get('event-time');
    const eventLocation = formData.get('event-location');
    const eventDescription = formData.get('event-desrcp');
    const isRecurring = formData.get('is-recurrence') === 'on';
    const recurrenceType = isRecurring ? (formData.get('recurrence') || null) : null;
    const repeatUntil = isRecurring ? formData.get('repeat-until') : null ;
    const frequency = isRecurring && recurrenceType === 'custom' ? formData.get('event-frequency') : '';
    const category = formData.get('event-category');
    
     if (isRecurring) {
        const recurringEvents = getAllRecurringEvents(
            eventName, eventDate, eventTime, eventLocation, eventDescription, recurrenceType, repeatUntil, frequency, category
        );
        events.push(...recurringEvents); 
    } else {
        const newEvent = new Event(
            eventName, eventDate, eventTime, eventLocation, eventDescription, false, null, null, '', category
        );
        events.push(newEvent);
    }

    saveEventsToLocalStorage(events);

    form.reset();
    clearFilter();
}

function getAllRecurringEvents(eventName, eventDate, eventTime, eventLocation, eventDescription, recurrenceType, repeatUntil, frequency, category) {
    const recurringEvents = [];
    console.log("creating reocuuring event");
    
    let currentDate = new Date(eventDate);
    let endDate = repeatUntil ? new Date(repeatUntil) : null;

    console.log(endDate);
    console.log(currentDate);
    console.log(currentDate <= endDate);
    
    while (currentDate <= endDate) {
        console.log("new event created");
        
        const newEvent = new Event(
            eventName, currentDate.toISOString().split('T')[0], eventTime, eventLocation, eventDescription, true, recurrenceType, repeatUntil, frequency, category
        );
        recurringEvents.push(newEvent);

        if (recurrenceType === 'daily') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (recurrenceType === 'weekly') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (recurrenceType === 'monthly') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (recurrenceType === 'custom') {
            const repeatFrequency = parseInt(frequency);
            currentDate.setDate(currentDate.getDate() + (repeatFrequency * 1)); 
        }
    }

    return recurringEvents;
}

function validateForm(formData) {
    
    const eventName = formData.get("event-name");
    if (!eventName || eventName.trim() === "") {
        alert("Event Name is required.");
        return false;
    }

    const eventDate = formData.get("event-date");
    if (!eventDate) {
        alert("Event Date is required.");
        return false;
    }

    
    const eventTime = formData.get("event-time");
    if (!eventTime) {
        alert("Event Time is required.");
        return false;
    }


    const eventLocation = formData.get("event-location");
    if (!eventLocation || eventLocation.trim() === "") {
        alert("Event Location is required.");
        return false;
    }

    const eventDescription = formData.get("event-desrcp");
    if (!eventDescription || eventDescription.trim() === "") {
        alert("Event Description is required.");
        return false;
    }

    const recurrenceCheckbox = formData.get("is-recurrence");
    if (recurrenceCheckbox === "on") { 
        const recurrenceType = formData.get("recurrence");
        if (!recurrenceType) {
            alert("Please select a recurrence type (Daily, Weekly, Monthly, or Custom).");
            return false;
        }

        if (recurrenceType === "custom") {
            const frequency = formData.get("event-frequency");
            if (!frequency || frequency === "") {
                alert("Please select a frequency for custom recurrence.");
                return false;
            }
        }
        const repeatUntil = formData.get("repeat-until");
        if (!repeatUntil) {
            alert("Please select a Repeat Until date.");
            return false;
        }
    }

    return true;
}

function exportEvents(file)
{
    console.log("i am in export event");
}

function showEvents()
{
    container = document.getElementById('event-container');
    container.innerHTML = '';
    
    let filteredEvents = getFilterEvents();
    filteredEvents.forEach((event,i) => {

        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.id = `event-card-${i}`;
        
        const eventDetails = document.createElement('div');
        eventDetails.classList.add('event-details');

        const eventDate = new Date(event.eventDate);
        const formattedDate = eventDate.toLocaleDateString('en-GB'); 

        // Format the event time (12-hour format with AM/PM)
        const formattedTime = convertTo12HourFormat(event.eventTime);

        eventDetails.innerHTML = `
            <h3 class="event-title">${event.eventName}</h3>
            <p class="event-date">${formattedDate} ${formattedTime}</p>
            <p class="event-location"><i>${event.eventLocation}</i></p>
            <p class="event-description">${event.eventDescription}</p>
            <p class="event-description"><strong>category: </strong>${event.category}</p>
            
            <div class="event-countdown">
                <div class="time-remaining">
                  ⏳ <span class="days">0</span> days
                  <span class="hours">0</span> hrs
                  <span class="minutes">0</span> min
                  <span class="seconds">0</span> sec
                </div>
            </div>
        `;
        
        const actions = document.createElement('div');
        actions.classList.add('event-actions');
        actions.innerHTML = `
            <button class="edit-btn action-btn"   onclick="openUpdateEventForm(${i})">✏️</button>
            <button class="delete-btn action-btn" onclick="deleteEvent(${i})">🗑️</button>
        `;
        
        eventCard.appendChild(eventDetails);
        eventCard.appendChild(actions);
        container.appendChild(eventCard);
        
        startCountdown(event, eventCard);
    });
}

function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0); 

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

function startCountdown(event, eventCard) {
    const countdownElement = eventCard.querySelector('.time-remaining');

    const eventDate = new Date(event.eventDate + " " + event.eventTime);  
    const eventTimestamp = eventDate.getTime();  
    
    const interval = setInterval(() => {
        const now = new Date().getTime();  
        const timeleft = eventTimestamp - now; 

        const days = Math.floor(timeleft / (1000 * 60 * 60 * 24)); 
        const hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); 
        const minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60)); 
        const seconds = Math.floor((timeleft % (1000 * 60)) / 1000); 

        countdownElement.querySelector('.days').textContent = days;
        countdownElement.querySelector('.hours').textContent = hours;
        countdownElement.querySelector('.minutes').textContent = minutes;
        countdownElement.querySelector('.seconds').textContent = seconds;
        
        if (timeleft < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = "Event Started!";
        }
    }, 1000); 
}

function deleteEvent(i)
{
    events.splice(i,1);
    saveEventsToLocalStorage(events);
    showEvents();
}

function updateEventForm(i, event) {
  const formContainer = document.createElement('form');
  formContainer.id = `event-form-${i}`;

  formContainer.innerHTML = `
  <div class="add-event-container">
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
            <input name="is-recurrence-${i}" type="checkbox" ${event.isRecurrence ? 'checked' : ''}>
            <span class="slider round"></span>
        </label>
    </div>

    <div class="radio-field">
        <div class="radio-item">
            <input type="radio" id="daily-${i}" name="recurrence-${i}" value="daily" ${event.recurrenceType === 'daily' ? 'checked' : ''}>
            <label for="daily-${i}">Daily</label>
        </div>
        <div class="radio-item">
            <input type="radio" id="weekly-${i}" name="recurrence-${i}" value="weekly" ${event.recurrenceType === 'weekly' ? 'checked' : ''}>
            <label for="weekly-${i}">Weekly</label>
        </div>
        <div class="radio-item">
            <input type="radio" id="monthly-${i}" name="recurrence-${i}" value="monthly" ${event.recurrenceType === 'monthly' ? 'checked' : ''}>
            <label for="monthly-${i}">Monthly</label>
        </div>
        <div class="radio-item">
            <input type="radio" id="custom-${i}" name="recurrence-${i}" value="custom" ${event.recurrenceType === 'custom' ? 'checked' : ''}>
            <label for="custom-${i}">Custom</label>
        </div>
    </div>

    <div class="form-grid">
        <div class="form-field">
            <label for="event-repeat-date-${i}">Repeat Until</label>
            <input type="date" id="event-repeat-date-${i}" name="repeat-until-${i}" value="${event.repeatUntil}">
        </div>
        <div class="form-field">
            <label for="event-frequency-${i}">Frequency</label>
            <select name="event-frequency-${i}" id="event-frequency-${i}">
                <option value="">Select...</option>
                <option value="1" ${event.frequency === 1 ? 'selected' : ''}>Every time</option>
                <option value="2" ${event.frequency === 2 ? 'selected' : ''}>Every 2nd time</option>
                <option value="3" ${event.frequency === 3 ? 'selected' : ''}>Every 3rd time</option>
                <option value="4" ${event.frequency === 4 ? 'selected' : ''}>Every 4th time</option>
            </select>
        </div>
    </div>

    <div class="form-field">
        <label for="event-category-${i}">Category</label>
        <select id="event-category-${i}" name="event-category-${i}">
            <option value="">Select a category</option>
            <option value="conference" ${event.category === 'conference' ? 'selected' : ''}>Conference</option>
            <option value="workshop" ${event.category === 'workshop' ? 'selected' : ''}>Workshop</option>
            <option value="seminar" ${event.category === 'seminar' ? 'selected' : ''}>Seminar</option>
            <option value="webinar" ${event.category === 'webinar' ? 'selected' : ''}>Webinar</option>
            <option value="meetup" ${event.category === 'meetup' ? 'selected' : ''}>Meetup</option>
            <option value="party" ${event.category === 'party' ? 'selected' : ''}>Party</option>
            <option value="other" ${event.category === 'other' ? 'selected' : ''}>Other</option>
        </select>
    </div>
</div>
      </div>
      <div class="btn-container">
          <button type="submit" class="form-btn primary-btn" onclick="updateEvent(${i})" >Save Event</button>
          <button type="reset" class="form-btn secondary-btn" onclick="closeEvent()">Close Form</button>
      </div>
      </div>
  `;

  return formContainer;
}

function openUpdateEventForm(i) {

    if (openFormId !== null) {
        showEvents();
    }

  const event = events[i];
  const formContainer = updateEventForm(i, event);

  const eventCard = document.getElementById(`event-card-${i}`);
  eventCard.replaceWith(formContainer);

  console.log(formContainer);
  

  openFormId = i; 
  console.log(openFormId);
}

function updateEvent(i)
{
    const updatedEvent = {
        eventName: document.getElementById(`event-name-${i}`).value,
        eventDate: document.getElementById(`event-date-${i}`).value,
        eventTime: document.getElementById(`event-time-${i}`).value,
        eventLocation: document.getElementById(`event-location-${i}`).value,
        eventDescription: document.getElementById(`event-desrcp-${i}`).value,
        eventRecurrence: document.querySelector(`input[name="recurrence-${i}"]:checked`)?.value,
        category: document.getElementById(`event-category-${i}`).value,
        isRecurring: document.querySelector(`input[name="is-recurrence-${i}"]`).checked,
        recurrenceType: document.querySelector(`input[name="recurrence-${i}"]:checked`)?.value || null,
        repeatUntil: document.querySelector(`input[name="is-recurrence-${i}"]`).checked
            ? document.getElementById(`event-repeat-date-${i}`).value
            : null,
        frequency: document.querySelector(`input[name="is-recurrence-${i}"]`).checked
            ? document.getElementById(`event-frequency-${i}`).value
            : ''
    };

    events[i] = updatedEvent;
    saveEventsToLocalStorage(events);
    
    showEvents();
    openFormId = null;
}

function closeEvent()
{
    showEvents();
}

function filterEvents() {
    const searchText = document.querySelector('.search-bar input').value.toLowerCase();
    const startDate = document.querySelector('input[type="date"]:nth-child(1)').value;
    const endDate = document.querySelector('input[type="date"]:nth-child(2)').value;
    const category = document.getElementById('filter-category').value;
    const sortCriteria = document.getElementById('sort-criteria').value;
    const sortOrder = document.getElementById('sort-order').value;

    let filteredEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const eventNameMatch = event.eventName.toLowerCase().includes(searchText);
        const eventDescriptionMatch = event.eventDescription.toLowerCase().includes(searchText);
        const eventLocationMatch = event.eventLocation.toLowerCase().includes(searchText);
        const dateMatch = (!startDate || eventDate >= new Date(startDate)) && (!endDate || eventDate <= new Date(endDate));
        const categoryMatch = !category || event.category === category;

        return (eventNameMatch || eventDescriptionMatch || eventLocationMatch) && dateMatch && categoryMatch;
    });

    filteredEvents.sort((a, b) => {
        if (sortCriteria === 'date') {
            return sortOrder === 'asc' 
                ? new Date(a.eventDate) - new Date(b.eventDate)
                : new Date(b.eventDate) - new Date(a.eventDate);
        } else if (sortCriteria === 'name') {
            return sortOrder === 'asc'
                ? a.eventName.localeCompare(b.eventName)
                : b.eventName.localeCompare(a.eventName);
        }
        return 0;
    });

    showEvents(filteredEvents);
}

function getFilterEvents() {
    const searchText = document.querySelector('.search-bar input').value.toLowerCase();
    const dateFilter = document.querySelector('.filter-group input[type=date]').value;
    const categoryFilter = document.getElementById('filter-category').value;
    const sortCriteria = document.getElementById('sort-criteria').value;
    const sortOrder = document.getElementById('sort-order').value;

    let filteredEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const eventNameMatch = event.eventName.toLowerCase().includes(searchText);
        const eventDescriptionMatch = event.eventDescription.toLowerCase().includes(searchText);
        const eventLocationMatch = event.eventLocation.toLowerCase().includes(searchText);
        const dateMatch = !dateFilter || eventDate.toISOString().split('T')[0] === dateFilter;
        const categoryMatch = !categoryFilter || event.category === categoryFilter;

        return (eventNameMatch || eventDescriptionMatch || eventLocationMatch) && dateMatch && categoryMatch;
    });

    filteredEvents.sort((a, b) => {
        const eventADateTime = new Date(`${a.eventDate}T${a.eventTime}`);
        const eventBDateTime = new Date(`${b.eventDate}T${b.eventTime}`);

        if (sortCriteria === 'date') {
            return sortOrder === 'asc' 
                ? eventADateTime - eventBDateTime  
                : eventBDateTime - eventADateTime; 
        } else if (sortCriteria === 'name') {
            return sortOrder === 'asc' 
                ? a.eventName.localeCompare(b.eventName)
                : b.eventName.localeCompare(a.eventName); 
        }
        return 0;
    });

    return filteredEvents;
}

function clearFilter()
{
    document.querySelector('.search-bar input').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('sort-criteria').value = 'date';
    document.getElementById('sort-order').value = 'asc';
    showEvents(); 
}

function checkUpcomingEvents() {
    const currentTime = new Date();
    events.forEach(event => {
        const eventDate = new Date(event.eventDate);
        const eventTime = event.eventTime;
        const eventStartTime = new Date(`${eventDate.toDateString()} ${eventTime}`);

        const timeDifference = eventStartTime - currentTime;
        console.log(`Event: ${event.eventName}`);
        console.log("Event start time: ", eventStartTime);
        console.log("Time difference in ms: ", timeDifference); 

        if (timeDifference > 0 && eventStartTime.toDateString() === currentTime.toDateString()) {
            const minutesRemaining = Math.floor(timeDifference / (1000 * 60)); 
            console.log(`Minutes remaining: ${minutesRemaining}`); 
        
        if (minutesRemaining <= 5 && !event.hasShown["5 minutes left"]) {
            showNotification(event, "5 minutes left!");
            event.hasShown["5 minutes left"] = true; 
        }
        

        else if (minutesRemaining <= 30 && minutesRemaining > 5 && !event.hasShown["30 minutes left"]) {
            showNotification(event, "30 minutes left!");
            event.hasShown["30 minutes left"] = true; 
        }
        

        else if (minutesRemaining <= 60 && minutesRemaining > 30 && !event.hasShown["1 hour left"]) {
            showNotification(event, "1 hour left!");
            event.hasShown["1 hour left"] = true; 
        }

        if (Math.abs(timeDifference) <= 1000 && !event.hasShown["Started :)"]) {
            showNotification(event, "Started :)");
            event.hasShown["Started :)"] = true; 
        
        }
    }
    });
}

function showNotification(event, timeLeft) {
    alert(`${event.eventName} is starting soon! ${timeLeft}\nLocation: ${event.eventLocation}\nDescription: ${event.eventDescription}`);
}


function exportEventsToCSV() {
   
    const header = ['Event Name', 'Event Date', 'Event Time', 'Event Location', 'Event Description', 'Is Recurring', 'Recurrence Type', 'Repeat Until', 'Frequency', 'Category'];
    
    const csvRows = [];
    
    csvRows.push(header.join(','));
    
    events.forEach(event => {
        const eventData = [
            event.eventName,
            event.eventDate,
            event.eventTime,
            event.eventLocation,
            event.eventDescription,
            event.isRecurring, 
            event.recurrenceType || '',
            event.repeatUntil || '',
            event.frequency || '',
            event.category
        ];
        csvRows.push(eventData.join(',')); 
    });
    
    const csvString = csvRows.join('\n');
    
   
    const blob = new Blob([csvString], { type: 'text/csv' });  
   
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'events.csv'; 
    link.click(); 
}

 const recurrenceCheckbox = document.getElementById('recurrence-checkbox');
 const recurrenceOptions = document.getElementById('recurrence-options');
 const repeatUntilContainer = document.getElementById('repeat-until-container');
 const eventForm = document.getElementById('event-form');
 const frequencySelect = document.getElementById('event-frequency');
 
 
 disableRecurrenceFields();
 frequencySelect.disabled = true; 

 function disableRecurrenceFields() {
     recurrenceOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
         radio.disabled = true;
     });
     repeatUntilContainer.querySelectorAll('input').forEach(input => {
         input.disabled = true;
     });
 }

 function enableRecurrenceFields() {
     recurrenceOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
         radio.disabled = false;
     });
     repeatUntilContainer.querySelectorAll('input').forEach(input => {
         input.disabled = false;
     });
 }

 function enableFrequencyField() {
     if (document.getElementById('custom').checked) {
         frequencySelect.disabled = false; 
         frequencySelect.disabled = true; 
     }
 }

 recurrenceCheckbox.addEventListener('change', function () {
     if (this.checked) {
         enableRecurrenceFields();
     } else {
         disableRecurrenceFields();
         frequencySelect.disabled = true; 
         recurrenceOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
             radio.checked = false;
         });
         repeatUntilContainer.querySelector('input[type="date"]').value = ''; 
     }
 });

  recurrenceOptions.addEventListener('change', enableFrequencyField);
