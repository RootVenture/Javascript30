let countdown;
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;

  console.log({ minutes, remainderSeconds });
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  document.title = display;
  timerDisplay.textContent = display;
}

function displayEndTime(timestamp) {
  const end = new Date(timestamp);
  const hour = end.getHours();
  const minutes = end.getMinutes();
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes}`;
}

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);

  const now = Date.now(); // time the timer started
  const then = now + seconds * 1000; // convert to ms
  displayTimeLeft(seconds); // run immediately once
  displayEndTime(then);
  // console.log({ now, then });
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000); // convert to sec
    // check if fn should stop
    if (secondsLeft < 0) {
      // to return our fn and stop the setInterval from running
      clearInterval(countdown);
      return;
    }
    displayTimeLeft(secondsLeft);
  }, 1000);
}

function startTimer() {
  const seconds = parseInt(this.dataset.time); // change the data to an int
  timer(seconds);
}
buttons.forEach(button => button.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
  e.preventDefault(); // stop form submission
  const min = this.minutes.value; // form name is 'minutes'
  this.reset(); // clear text within form
  timer(min * 60);
});
