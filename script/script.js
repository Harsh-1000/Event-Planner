/**
 * Event constructor function.
 * 
 * @param {string} eventName - The name of the event.
 * @param {string} eventDate - The date of the event.
 * @param {string} eventTime - The time of the event.
 * @param {string} eventLocation - The location of the event.
 * @param {string} eventDescription - A description of the event.
 * @param {boolean} eventRecurring - Whether the event is recurring.
 * @param {string} recurrenceType - The type of recurrence.
 * @param {string} repeatUntil - The end date for a recurring event.
 * @param {string} frequency - The frequency of recurrence.
 * @param {string} category - The category of the event.
 */
function Event(eventName, eventDate, eventTime,eventLocation, eventDescription, eventRecurring, recurrenceType, repeatUntil, frequency, category) 
{
    this.eventId = Date.now() + Math.floor(Math.random() * 1000);
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
    this.status = "upcoming";
    this.hasShown = {
        "15 minutes left": false,
        "30 minutes left": false,
        "1 hour left": false,
        "Started :)": false
    };
}

/**
 * The form element used to create event.
 */
const form = document.getElementById('event-form');

/**
 * An array that stores all events.
 * @type {Array.<Event>}
 */
var events = [];

/**
 * The checkbox element for toggling whether the event is recurring or not.
 */
const recurrenceCheckbox = document.getElementById('recurrence-checkbox');

/**
 * The element that holds the options for recurring events.
 */
const recurrenceOptions = document.getElementById('recurrence-options');

/**
 * The container for the "repeat until" input field, visible only if the event is recurring.
 */
const repeatUntilContainer = document.getElementById('repeat-until-container');

/**
 * The form element that contains all the input fields for creating events.
 */
const eventForm = document.getElementById('event-form');

/**
 * element for choosing the frequency of a recurring event.
 */
const frequencySelect = document.getElementById('event-frequency');

/**
 * Initializes event-related functionalities when the page is loaded.
 * This function is executed when the window's load event is triggered.
 */
window.onload = ()=>{
    events = getStoredEvents();
    showEvents();
    disableRecurrenceFields();
    frequencySelect.disabled = true; 
}

/**
 * Event listener for the `beforeunload` event, which is triggered before the window or tab is closed or reloaded.
 * This listener saves all events to local storage to persist them before the page is unloaded. 
 */
window.addEventListener('beforeunload', () => {
    saveEventsToLocalStorage(events);
})

/**
 * Adds an event listener to the search input field, which triggers the `showEvents` function whenever the user types something in the search bar.
 * This allows for dynamic filtering of events as the user types.
 */
document.querySelector('.search-bar input').addEventListener('input', showEvents);

/**
 * Adds an event listener to the date field, which triggers the `showEvents` function whenever the user types something in the search bar.
 * This allows for dynamic filtering of events as the user types.
 */
document.querySelector('.filter-group input[type=date]').addEventListener('change', showEvents);

/**
 * Adds an event listener to the category filter dropdown, which triggers the `showEvents` function whenever the user selects a different category.
 * This allows for dynamic filtering of events as the user types. 
 */
document.getElementById('filter-category').addEventListener('change', showEvents);

/**
 * Adds an event listener to the sort criteria dropdown, which triggers the `showEvents` function whenever the user selects a different sorting criterion.
 */
document.getElementById('sort-criteria').addEventListener('change', showEvents);

/**
 * Adds an event listener to the sort order dropdown, which triggers the `showEvents` function whenever the user selects a different sort order.
 */
document.getElementById('sort-order').addEventListener('change', showEvents);

/**
 * Adds an event listener to the status filter dropdown, which triggers the `showEvents` function whenever the user selects a different status.
 */
document.getElementById('filter-status').addEventListener('change', showEvents);

/**
 * Adds an event listener to the clear filters button, which triggers the `clearFilter` function when clicked.
 */
document.querySelector('.clear-filters').addEventListener('click', clearFilter);

/**
 * Adds an event listener to the recurrence options, which triggers the `enableFrequencyField` function when the user selects recurrence options.
 */
recurrenceOptions.addEventListener('change', enableFrequencyField);


/**
 * Retrieves the stored events from localStorage.
 * @returns {Array.<Event>} 
 */
function getStoredEvents() {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
}

/**
 * Saves the provided array of event objects to localStorage
 * @param {Array.<Event>} events - An array of event objects
 */
function saveEventsToLocalStorage(events) {
    localStorage.setItem('events', JSON.stringify(events));
}

/**
 * Disables the recurrence-related input fields in the event form.
 */
function disableRecurrenceFields() {
    recurrenceOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = true;
        radio.checked = false;
    });
    document.getElementById('event-repeat-date').disabled = true;
    document.getElementById('event-repeat-date').value = '';
}

/**
 * Enables the recurrence-related input fields in the event form.
 */
function enableRecurrenceFields() {
    recurrenceOptions.querySelectorAll('input[type="radio"]').forEach(radio => {
        radio.disabled = false;
    });
    document.getElementById('event-repeat-date').disabled = false;
}

/**
 * Enables or disables the frequency selection field based on the custom recurrence option.
 * If the "custom" radio button is checked, the frequency selection dropdown is enabled.
 * Otherwise, it is disabled.
 */
function enableFrequencyField() {
    if (document.getElementById('custom').checked) {
        frequencySelect.disabled = false; 
    }
    else
    {
         frequencySelect.disabled = true; 
         frequencySelect.value="";
    }
}

/**
 * Event listener for the "change" event on the recurrence checkbox.
 * This function is triggered when the user checks or unchecks the recurrence checkbox.
 * 
 * - If the checkbox is checked, the recurrence fields are enabled
 * - If the checkbox is unchecked, the recurrence fields are disabled 
 */
recurrenceCheckbox.addEventListener('change', function () {
    if (this.checked) {
        enableRecurrenceFields();
    } else {
        disableRecurrenceFields();
        enableFrequencyField();
    }
});

/**
 * Event listener for the form submission.
 * This function prevents the default form submission behavior and triggers
 * the `addNewEvent` function to add a new event to the list.
 */
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    addNewEvent();
    disableRecurrenceFields();
    enableFrequencyField();

});

form.addEventListener('reset',() => {
    disableRecurrenceFields();
    enableFrequencyField();
});

/**
 * Adds a new event to the list of events.
 * This function collects form data, validates the input, and creates either a single event
 * or multiple recurring events based on the user's input. After adding the events,
 * it saves them to localStorage and resets the form.
 */
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
    const recurrenceType = isRecurring ? formData.get('recurrence')  : null;
    const repeatUntil = isRecurring ? formData.get('repeat-until') : null ;
    const frequency = isRecurring && recurrenceType === 'custom' ? formData.get('event-frequency') : '';
    const category = formData.get('event-category');
    
     if (isRecurring) {
        const recurringEvents = getAllRecurringEvents(
            eventName, eventDate, eventTime, eventLocation, eventDescription,recurrenceType, repeatUntil, frequency, category
        );
        events.push(...recurringEvents); 
        alert('Events Added Successfully :)');

    } else {
        const newEvent = new Event(
            eventName, eventDate, eventTime, eventLocation, eventDescription, false, null, null, '', category
        );
        events.push(newEvent);
        alert('Event Added Successfully :)');
    }

    form.reset();
    clearFilter();
}

/**
 * Generates a list of recurring events based on the specified recurrence settings.
 * 
 * This function creates multiple event objects based on the recurrence pattern defined by the user.
 * 
 * @param {string} eventName - The name of the event.
 * @param {string} eventDate - The date of the event.
 * @param {string} eventTime - The time of the event.
 * @param {string} eventLocation - The location of the event.
 * @param {string} eventDescription - A description of the event.
 * @param {string} recurrenceType - The type of recurrence.
 * @param {string} repeatUntil - The end date for a recurring event.
 * @param {string} frequency - The frequency of recurrence.
 * @param {string} category - The category of the event.
 * 
 * @returns {Array} An array of Event objects 
 */
function getAllRecurringEvents(eventName, eventDate,eventTime, eventLocation, eventDescription,recurrenceType, repeatUntil, frequency, category) {
    const recurringEvents = [];
    console.log("creating reocuuring event");
    
    let currentDate = new Date(eventDate);
    let endDate = repeatUntil ? new Date(repeatUntil) : null;
    
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

/**
 * Validates the form data before adding a new event.
 * 
 * This function checks that all required fields are filled out correctly in the form.
 * @param {FormData} formData - The FormData object containing the form's input values.
 * 
 * @returns {boolean}
 */
function validateForm(formData) {

    const eventDate = formData.get("event-date");
    const eventName = formData.get("event-name");
    const eventTime = formData.get("event-time");
    const eventDescription = formData.get("event-desrcp");
    const eventLocation = formData.get("event-location");
    const recurrenceCheckbox = formData.get("is-recurrence");
    const repeatUntil = formData.get("repeat-until");
        
    if (!eventName || eventName.trim() === "") {
        alert("Event Name is required.");
        return false;
    }

   
    if (!eventDate) {
        alert("Event Date is required.");
        return false;
    }


    if (!eventTime) {
        alert("Event Time is required.");
        return false;
    }


    if (!eventLocation || eventLocation.trim() === "") {
        alert("Event Location is required.");
        return false;
    }

    
    if (!eventDescription || eventDescription.trim() === "") {
        alert("Event Description is required.");
        return false;
    }

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

        if (!repeatUntil) {
            alert("Please select a Repeat Until date.");
            return false;
        }
            
    }

    return true;
}

/**
 * Displays the list of events in the event container.
 */
function showEvents() {
    const container = document.getElementById('event-container');
    container.innerHTML = '';

    let filteredEvents = getFilterEvents();
    
    for (const event of filteredEvents) {
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        eventCard.id = `event-card-${event.eventId}`;

        const eventDetails = document.createElement('div');
        eventDetails.classList.add('event-details');

        const eventDate = new Date(event.eventDate);
        const formattedDate = eventDate.toLocaleDateString('en-GB'); 

        const formattedTime = convertTo12HourFormat(event.eventTime);

             eventDetails.innerHTML = `
            <h3 class="event-title">${event.eventName}</h3>
            <p class="event-date">${formattedDate} ${formattedTime}</p>
            <p class="event-location"><strong>${event.eventLocation}</strong></p>
            <p class="event-description"><strong>description: </strong>${event.eventDescription}</p>
            <p class="event-description"><strong>category: </strong>${event.category}</p>
            <p class="event-description"><strong>status: </strong><span class="event-status">${event.status}</span></p>
            
            <div class="event-countdown">
                <div class="time-remaining">
                  &#x1F552; <span class="days">0</span> days
                  <span class="hours">0</span> hrs
                  <span class="minutes">0</span> min
                  <span class="seconds">0</span> sec
                </div>
            </div>
        `;

        const actions = document.createElement('div');
        actions.classList.add('event-actions');
        actions.innerHTML = `
            <button class="edit-btn action-btn" onclick="editEvent(${event.eventId})">✏️ Edit</button>
            <button class="delete-btn action-btn" onclick="deleteEvent(${event.eventId})">🗑️ Delete</button>
        `;

        eventCard.appendChild(eventDetails);
        eventCard.appendChild(actions);
        container.appendChild(eventCard);

        startCountdown(event, eventCard);
    }
}

function editEvent(eventId) {
    const eventCard = document.getElementById(`event-card-${eventId}`);
    const eventDetails = eventCard.querySelector('.event-details');
    const event = getEventById(eventId); 
    eventDetails.innerHTML = `
        <div class="add-event-form form-left">
            <div class="form-field">
                <label for="event-name">Event Name</label>
                <input type="text" id="event-name-${eventId}" value="${event.eventName}" required>
            </div>
            <div class="form-grid">
                <div class="form-field">
                    <label for="event-date">Start Date</label>
                    <input type="date" id="event-date-${eventId}" value="${new Date(event.eventDate).toISOString().split('T')[0]}" required>
                </div>
                <div class="form-field">
                    <label for="event-time">Start Time</label>
                    <input type="time" id="event-time-${eventId}" value="${event.eventTime}" required>
                </div>
            </div>
            <div class="form-field">
                <label for="event-location">Location</label>
                <input type="text" id="event-location-${eventId}" value="${event.eventLocation}" required>
            </div>
            <div class="form-field">
                <label for="event-description">Description</label>
                <textarea id="event-description-${eventId}" required>${event.eventDescription}</textarea>
            </div>
            <div class="form-field">
                <label for="event-category">Category</label>
                <select id="event-category-${eventId}" required>
                    <option value="conference" ${event.category === "conference" ? "selected" : ""}>Conference</option>
                    <option value="workshop" ${event.category === "workshop" ? "selected" : ""}>Workshop</option>
                    <option value="seminar" ${event.category === "seminar" ? "selected" : ""}>Seminar</option>
                    <option value="webinar" ${event.category === "webinar" ? "selected" : ""}>Webinar</option>
                    <option value="meetup" ${event.category === "meetup" ? "selected" : ""}>Meetup</option>
                    <option value="party" ${event.category === "party" ? "selected" : ""}>Party</option>
                    <option value="other" ${event.category === "other" ? "selected" : ""}>Other</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="form-btn primary-btn" onclick="saveEventChanges(${eventId})"> Save Event</button>
                <button type="button" class="form-btn secondary-btn" onclick="displayEvent(${eventId})">Close</button>
            </div>
        </div>
       
    `;
}

function saveEventChanges(eventId) {
    
    const eventCard = document.getElementById(`event-card-${eventId}`);

    const eventData = {
        "event-date": document.getElementById(`event-date-${eventId}`).value,
        "event-name": document.getElementById(`event-name-${eventId}`).value.trim(),
        "event-time": document.getElementById(`event-time-${eventId}`).value,
        "event-location": document.getElementById(`event-location-${eventId}`).value.trim(),
        "event-desrcp": document.getElementById(`event-description-${eventId}`).value.trim(),
        "event-category" : document.getElementById(`event-category-${eventId}`).value
    };

    const formData = new Map(Object.entries(eventData));

    if (!validateForm(formData)) {
        return; 
    }

    const eventIndex = events.findIndex(event => event.eventId === eventId);

    events[eventIndex] = {
        ...events[eventIndex], 
        eventName: eventData["event-name"],
        eventDate: eventData["event-date"],
        eventTime: eventData["event-time"],
        eventLocation: eventData["event-location"],
        eventDescription: eventData["event-desrcp"],
        category: document.getElementById(`event-category-${eventId}`).value,
    };
    
    displayEvent(eventId);
}

function displayEvent(eventId) {
    const eventCard = document.getElementById(`event-card-${eventId}`);
    const eventDetails = eventCard.querySelector('.event-details');
    const event = getEventById(eventId); 
    const eventDate = new Date(event.eventDate);
    const formattedDate = eventDate.toLocaleDateString('en-GB'); 

    const formattedTime = convertTo12HourFormat(event.eventTime);

    eventDetails.innerHTML = `
    <h3 class="event-title">${event.eventName}</h3>
    <p class="event-date">${formattedDate} ${formattedTime}</p>
    <p class="event-location"><strong>${event.eventLocation}</strong></p>
    <p class="event-description"><strong>description: </strong>${event.eventDescription}</p>
    <p class="event-description"><strong>category: </strong>${event.category}</p>
    <p class="event-description"><strong>status: </strong><span class="event-status">${event.status}</span></p>
    
    <div class="event-countdown">
        <div class="time-remaining">
          &#x1F552; <span class="days">0</span> days
          <span class="hours">0</span> hrs
          <span class="minutes">0</span> min
          <span class="seconds">0</span> sec
        </div>
    </div>
`;
 startCountdown(event, eventCard);
}

function getEventById(eventId) {
    return getFilterEvents().find(event => event.eventId === eventId); 
}
/**
 * Converts a 24-hour time string to a 12-hour time format with AM/PM.
 * 
 * @param {string} time 
 * 
 * @returns {string} 
 */
function convertTo12HourFormat(time) {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours));
    date.setMinutes(parseInt(minutes));
    date.setSeconds(0); 

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

/**
 * Starts a countdown timer for an event and updates the event's status when the event time is reached.
 * 
 * This function calculates the remaining time until the event and updates the countdown every second. 
 * 
 * @param {Object} event
 * @param {HTMLElement} eventCard
 */
function startCountdown(event, eventCard) {

    const countdownElement = eventCard.querySelector('.time-remaining');
    const eventStatusElement = eventCard.querySelector('.event-status');
    eventStatusElement.innerHTML = "upcoming";
    event.status = "upcoming";
    const eventDate = new Date(event.eventDate + " " + event.eventTime);  
    const eventTimestamp = eventDate.getTime();  

    
        const interval = setInterval(() => {
            checkUpcomingEvent(event);
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
                countdownElement.innerHTML = "Enjoy Your Event";
                eventStatusElement.innerHTML = "ongoing";
                event.status = "ongoing";
            }
        }, 1000);

}

/**
 * Deletes an event from the events list by its ID.
 *
 * @param {number} id - The unique id of the event to be deleted.
 */
function deleteEvent(id)
{
    const eventIndex = events.findIndex(event => event.eventId === id);
    events.splice(eventIndex,1);
    const eventCard = document.getElementById(`event-card-${id}`);
    const container = document.getElementById('event-container');
    container.removeChild(eventCard);
}

/**
 * Filters and sorts the events based on user inputs such as search text, date, category, status, and sort criteria.
 * @returns {Array} - Returns a filtered and sorted array of event objects 
 */
function getFilterEvents() {
    const searchText = document.querySelector('.search-bar input').value.toLowerCase();
    const dateFilter = document.querySelector('.filter-group input[type=date]').value;
    const categoryFilter = document.getElementById('filter-category').value;
    const sortCriteria = document.getElementById('sort-criteria').value;
    const sortOrder = document.getElementById('sort-order').value;
    const status = document.getElementById('filter-status').value; 

    let filteredEvents = events.filter(event => {
        const eventDate = new Date(event.eventDate);
        const eventNameMatch = event.eventName.toLowerCase().includes(searchText);
        const eventDescriptionMatch = event.eventDescription.toLowerCase().includes(searchText);
        const eventLocationMatch = event.eventLocation.toLowerCase().includes(searchText);
        const dateMatch = !dateFilter || eventDate.toISOString().split('T')[0] === dateFilter;
        const categoryMatch = !categoryFilter || event.category === categoryFilter;
        const statusMatch = !status || event.status === status;

        return (eventNameMatch || eventDescriptionMatch || eventLocationMatch) && dateMatch && categoryMatch && statusMatch;
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

/**
 * Clears all the filters and resets the filter inputs to their default values.
 */
function clearFilter()
{
    document.querySelector('.search-bar input').value = '';
    document.getElementById('filter-date').value = '';
    document.getElementById('filter-category').value = '';
    document.getElementById('sort-criteria').value = 'date';
    document.getElementById('sort-order').value = 'asc';
    document.getElementById('filter-status').value = '';
    showEvents(); 
}

/**
 * Checks the upcoming events and shows notifications at specific time intervals (15 minutes, 30 minutes, 1 hour, and when the event starts).
 * 
 */
function checkUpcomingEvent(event) {
    const eventDate = new Date(event.eventDate);
    const eventTime = event.eventTime;
    const eventStartTime = new Date(`${eventDate.toDateString()} ${eventTime}`);
    const currentTime = new Date();
    const timeDifference = eventStartTime - currentTime;
    if (timeDifference > 0) {
        const minutesRemaining = Math.floor(timeDifference / (1000 * 60)); 
        console.log(`Minutes remaining: ${minutesRemaining}`); 
    
        if (minutesRemaining === 15 && !event.hasShown["15 minutes left"]) {
            showNotification(event, "15 minutes left!");
            event.hasShown["15 minutes left"] = true; 
        }
        

        else if (minutesRemaining === 30  && !event.hasShown["30 minutes left"]) {
            showNotification(event, "30 minutes left!");
            event.hasShown["30 minutes left"] = true; 
        }
        

        else if (minutesRemaining === 60 && !event.hasShown["1 hour left"]) {
            showNotification(event, "1 hour left!");
            event.hasShown["1 hour left"] = true; 
        }

        else if (Math.abs(timeDifference) <= 1000 && !event.hasShown["Started :)"]) {
            showNotification(event, "Started :)");
            event.hasShown["Started :)"] = true; 
        
        }
    }            
}

/**
 * Displays a notification to the user about an upcoming event or when the event has started.
 */
function showNotification(event, timeLeft) {
    if(timeLeft==="Started :)")
    {
        alert(`${event.eventName} is ${timeLeft}\nLocation: ${event.eventLocation}\nDescription: ${event.eventDescription}`);
    }
    else
    {
        alert(`${event.eventName} is starting soon! ${timeLeft}\nLocation: ${event.eventLocation}\nDescription: ${event.eventDescription}`);
    } 
}

/**
 * Exports the list of events to a CSV file.
 */
function exportEventsToCSV() {
   
    const header = ['Event Name', 'Event Date', 'Event Time', 'Event Location', 'Event Description', 'Is Recurring', 'Recurrence Type', 'Repeat Until', 'Frequency', 'Category','Event Status'];
    
    const csvRows = [];
    
    csvRows.push(header.join(','));
    
    events.forEach(event => {
        const eventData = [
            event.eventName,
            event.eventDate,
            event.eventTime,
            event.eventLocation,
            event.eventDescription,
            event.eventRecurring ? 'Yes' : 'No', 
            event.recurrenceType || 'none',
            event.repeatUntil || 'none',
            event.frequency || 'none',
            event.category,
            event.status
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


  