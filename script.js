// script.js

// 1st Feature
const img = new Image(); // used to load image from <input> and draw to canvas

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
  // TODO

  // Some helpful tips:
  // - Fill the whole Canvas with black first to add borders on non-square images, then draw on top
  // - Clear the form when a new image is selected
  // - If you draw the image to canvas here, it will update as soon as a new image is selected

  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  document.querySelector('button[type=submit]').disabled = false;
  document.querySelector('button[type=reset]').disabled = true;
  document.querySelector('button[type=button]').disabled = true;

  var dim = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  ctx.drawImage(img, dim['startX'], dim['startY'], dim['width'], dim['height']);
});

// 2nd Feature
const imgInput = document.getElementById('image-input');

imgInput.addEventListener('change', () => {
  img.src = URL.createObjectURL(imgInput.files[0]);
  img.alt = imgInput.files[0].name;
});

// 3rd Feature
const form = document.getElementById('generate-meme');

form.addEventListener('submit', () => {
  var topText = document.getElementById('text-top').value;
  var botText = document.getElementById('text-bottom').value;

  event.preventDefault();

  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');
  
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.textAlign = 'center';
  
  ctx.textBaseline = 'top';
  ctx.fillText(topText, canvas.width / 2, 5);
  ctx.strokeText(topText, canvas.width / 2, 5);

  ctx.textBaseline = 'bottom';
  ctx.fillText(botText, canvas.width / 2, canvas.height - 5);
  ctx.strokeText(botText, canvas.width / 2, canvas.height - 5);

  document.querySelector('button[type=submit]').disabled = true;
  document.querySelector('button[type=reset]').disabled = false;
  document.querySelector('button[type=button]').disabled = false;
});

// 4th Feature
const clear = document.querySelector('button[type=reset]');

clear.addEventListener('click', () => {
  var canvas = document.getElementById('user-image');
  var ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  document.querySelector('button[type=submit]').disabled = false;
  document.querySelector('button[type=reset]').disabled = true;
  document.querySelector('button[type=button]').disabled = true;
});

// 5th Feature
document.querySelector('select').disabled = false;
const tts = document.querySelector('button[type=button]');

var voiceList = document.getElementById('voice-selection');
var synth = window.speechSynthesis;
var voices = [];

PopulateVoices();
if(speechSynthesis !== undefined){
  speechSynthesis.onvoiceschanged = PopulateVoices;
}

tts.addEventListener('click', () => {

  var topText = document.getElementById('text-top').value;
  var botText = document.getElementById('text-bottom').value;

  var toSpeak = new SpeechSynthesisUtterance(topText + " " + botText);
  var selectedVoiceName = voiceList.selectedOptions[0].getAttribute('data-name');
  voices.forEach((voice) => {
      if(voice.name === selectedVoiceName) {
          toSpeak.voice = voice;
      }
  });
  synth.speak(toSpeak);
});

function PopulateVoices() {
  voices = synth.getVoices();
  var selectedIndex = voiceList.selectedIndex < 0 ? 0 : voiceList.selectedIndex;
  voiceList.innerHTML = '';
  voices.forEach((voice) => {
      var listItem = document.createElement('option');
      listItem.textContent = voice.name;
      listItem.setAttribute('data-lang', voice.lang);
      listItem.setAttribute('data-name', voice.name);
      voiceList.appendChild(listItem);
  });

  voiceList.selectedIndex = selectedIndex;
}

// 6th Feature


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
