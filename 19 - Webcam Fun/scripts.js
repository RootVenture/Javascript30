const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then(localMediaStream => {
      // localMediaStream is an object that needs to be converted to a URL
      video.src = window.URL.createObjectURL(localMediaStream);
      video.play();
    })
    .catch(err => {
      console.error(`OH NO!!!!`, err);
    });
}

function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // r
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // g
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // b
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0]; // r
    pixels.data[i + 500] = pixels.data[i + 1]; // g
    pixels.data[i - 550] = pixels.data[i + 2]; // b
  }
  return pixels;
}

function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  // ensure that the canvas has the same size as the video
  canvas.width = width;
  canvas.height = height;
  // take a frame from our webcam every 16 ms
  return setInterval(() => {
    // target our canvas and push the video/image to it
    ctx.drawImage(video, 0, 0, width, height);
    // extract pixels
    let pixels = ctx.getImageData(0, 0, width, height);
    // update the pixels
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    pixels = greenScreen(pixels);
    ctx.globalAlpha = 0.1; // add transparancy of 10% of our current image on top
    // return pixels into html
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function greenScreen(pixels) {
  const levels = {}; // hold our min & max green
  document.querySelectorAll('.rgb input').forEach(input => {
    levels[input.name] = input.value;
  });
  for (let i = 0; i < pixels.data.length; i += 4) {
    const red = pixels.data[i + 0]; // r
    const green = pixels.data[i + 1]; // g
    const blue = pixels.data[i + 2]; // b
    const alpha = pixels.data[i + 3]; // b

    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red >= levels.rmax &&
      green >= levels.gmax &&
      blue >= levels.bmax
    ) {
      // take it out!; set alpha to 0
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
function takePhoto() {
  // play our sound
  snap.currentTime = 0;
  snap.play();

  // take data out of our canvas
  const data = canvas.toDataURL('image/jpeg');
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', 'handsome');
  link.innerHTML = `<img src="${data}" alt="Handsome Man"/>`;
  strip.insertBefore(link, strip.firstChild);
}

getVideo();
// listen for the canplay event from our video element
video.addEventListener('canplay', paintToCanvas);
