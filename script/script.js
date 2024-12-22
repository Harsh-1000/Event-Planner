const form = document.getElementById('event-form');
var events = [];

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
}

window.onload = ()=>{
    events = getStoredEvents();
    showEvents();
}

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
    const fileInput = document.getElementById('event-file');
    const file = fileInput.files[0];

    if(file) {
        exportEvents(file);
        form.reset();
        return;
    }

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
    const recurrenceType = isRecurring ? getCheckedRecurrenceType(formData) : null;
    const repeatUntil = isRecurring && recurrenceType === 'custom' ? formData.get('repeat-until') : null;
    const frequency = isRecurring && recurrenceType === 'custom' ? formData.get('event-frequency') : '';
    const category = formData.get('event-category');
    
    const newEvent = new Event(
        eventName,
        eventDate,
        eventTime,
        eventLocation,
        eventDescription,
        isRecurring,
        recurrenceType,
        repeatUntil,
        frequency,
        category
    );

    events.push(newEvent);
    saveEventsToLocalStorage(events);

    form.reset();

    showEvents();
}

function validateForm(formData)
{
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
    for (let i = events.length - 1; i >= 0; i--) {
        const event = events[i];
        const eventCard = document.createElement('div');
        eventCard.classList.add('event-card');
        
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
            <button class="edit-btn action-btn"  onclick="updateEvent(${i})">✏️</button>
            <button class="delete-btn action-btn" onclick="deleteEvent(${i})">🗑️</button>
        `;
        
        eventCard.appendChild(eventDetails);
        eventCard.appendChild(actions);
        container.appendChild(eventCard);
    
        startCountdown(event, eventCard);
    }  
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

function updateEvent(i)
{
    
}