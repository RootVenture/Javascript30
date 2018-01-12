// Get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

// function build
function togglePlay() {
  const method = video.paused ? 'play' : 'pause';
  video[method]();
}

function updateButton() {
  const icon = this.paused ? '►' : '❚ ❚';
  toggle.textContent = icon;
}

function skip() {
  // console.log(this.dataset.skip);
  video.currentTime += parseFloat(this.dataset.skip);
}

function handleRangeUpdate() {
  // console.log(this.name);
  // console.log(this.value);
  video[this.name] = this.value;
}

function handleProgress() {
  const percent = video.currentTime / video.duration * 100;
  // update our progress bar
  progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
  const scrubbed = e.offsetX / progress.offsetWidth * video.duration;
  video.currentTime = scrubbed;
}

// event listeners
video.addEventListener('click', togglePlay);
toggle.addEventListener('click', togglePlay);
video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);
video.addEventListener('timeupdate', handleProgress);
ranges.forEach(range => {
  range.addEventListener('change', handleRangeUpdate);
});
skipButtons.forEach(button => {
  button.addEventListener('click', skip);
});

// TODO: Update with flag so the mousedown does not trigger the property, only mouseup does.
let skipdown = false;
skipButtons.forEach(button => {
  button.addEventListener('mousemove', skipdown && skip);
  button.addEventListener('mousedown', () => {
    skipdown = true;
  });
  button.addEventListener('up', () => {
    skipdown = false;
  });
});

let mousedown = false;
progress.addEventListener('click', scrub);
// pass our event in scrub
progress.addEventListener('mousemove', e => mousedown && scrub(e));
progress.addEventListener('mousedown', () => {
  mousedown = true;
});
progress.addEventListener('mouseup', () => {
  mousedown = false;
});
