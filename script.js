const hoursDisplay = document.getElementById('hours');
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const millisecondsDisplay = document.getElementById('milliseconds');

const startStopBtn = document.getElementById('startStopBtn');
const resetBtn = document.getElementById('resetBtn');
const lapBtn = document.getElementById('lapBtn');
const displayContainer = document.querySelector('.display');

const lapsList = document.getElementById('lapsList');
const clearLapsBtn = document.getElementById('clearLapsBtn');
const emptyLapsMsg = document.querySelector('.empty-laps');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let isRunning = false;
let lapCounter = 1;

function formatTime(time) {
    const date = new Date(time);
    const h = Math.floor(time / 3600000);
    const m = date.getUTCMinutes();
    const s = date.getUTCSeconds();
    const ms = Math.floor(date.getUTCMilliseconds() / 10);

    return {
        hours: h.toString().padStart(2, '0'),
        minutes: m.toString().padStart(2, '0'),
        seconds: s.toString().padStart(2, '0'),
        milliseconds: ms.toString().padStart(2, '0')
    };
}

function updateDisplay() {
    const formattedTime = formatTime(elapsedTime);
    hoursDisplay.textContent = formattedTime.hours;
    minutesDisplay.textContent = formattedTime.minutes;
    secondsDisplay.textContent = formattedTime.seconds;
    millisecondsDisplay.textContent = formattedTime.milliseconds;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(() => {
        elapsedTime = Date.now() - startTime;
        updateDisplay();
    }, 10);
    
    startStopBtn.textContent = 'Stop';
    startStopBtn.classList.add('stop');
    displayContainer.classList.add('running');
    
    resetBtn.disabled = false;
    lapBtn.disabled = false;
    isRunning = true;
}

function stopTimer() {
    clearInterval(timerInterval);
    startStopBtn.textContent = 'Start';
    startStopBtn.classList.remove('stop');
    displayContainer.classList.remove('running');
    
    lapBtn.disabled = true;
    isRunning = false;
}

function resetTimer() {
    stopTimer();
    elapsedTime = 0;
    updateDisplay();
    resetBtn.disabled = true;
    lapBtn.disabled = true;
}

function addLap() {
    if (emptyLapsMsg) {
        emptyLapsMsg.style.display = 'none';
        clearLapsBtn.style.display = 'block';
    }
    
    const formattedTime = formatTime(elapsedTime);
    const timeString = `${formattedTime.hours !== '00' ? formattedTime.hours + ':' : ''}${formattedTime.minutes}:${formattedTime.seconds}.${formattedTime.milliseconds}`;
    
    const lapItem = document.createElement('li');
    lapItem.classList.add('lap-item');
    lapItem.innerHTML = `
        <span>Lap ${lapCounter.toString().padStart(2, '0')}</span>
        <span>${timeString}</span>
    `;
    
    lapsList.prepend(lapItem);
    lapCounter++;
}

function clearLaps() {
    const laps = document.querySelectorAll('.lap-item');
    laps.forEach(lap => lap.remove());
    lapCounter = 1;
    clearLapsBtn.style.display = 'none';
    if (emptyLapsMsg) {
        emptyLapsMsg.style.display = 'block';
    } else {
        const msg = document.createElement('li');
        msg.classList.add('empty-laps');
        msg.textContent = 'No laps recorded';
        lapsList.appendChild(msg);
    }
}

startStopBtn.addEventListener('click', () => {
    if (isRunning) {
        stopTimer();
    } else {
        startTimer();
    }
});

resetBtn.addEventListener('click', resetTimer);
lapBtn.addEventListener('click', addLap);
clearLapsBtn.addEventListener('click', clearLaps);

// Initialize display
updateDisplay();
