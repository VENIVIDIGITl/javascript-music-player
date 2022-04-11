const image = document.querySelector('img');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const music = document.querySelector('audio');
const progressContainer = document.getElementById('progress-container');
const progressSlider = document.getElementById('progress-slider');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const prevBtn = document.getElementById('prev');
const playBtn = document.getElementById('play');
const nextBtn = document.getElementById('next');
const volumeSlider = document.getElementById('volume-slider');


const songs = [
  {
    name: '1',
    displayName: 'Hackers',
    artist: 'Karl Casey'
  },
  {
    name: '2',
    displayName: 'Last Stop',
    artist: 'Karl Casey'
  },
  {
    name: '3',
    displayName: 'Lost in the Matrix',
    artist: 'Karl Casey'
  },
  {
    name: '4',
    displayName: 'Rise of the Machines',
    artist: 'Karl Casey'
  }
];

let lightMode = false;
music.volume = 0.5;
setRangeBackground(volumeSlider, volumeSlider.value);
let isPlaying = false;
let songIndex = 0; // Current Song


function playSong() {
  isPlaying = true;
  playBtn.classList.replace('fa-play', 'fa-pause');
  playBtn.setAttribute('title', 'Pause');
  music.play();
}


function pauseSong() {
  isPlaying = false;
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
  music.pause();
}


// Play or Pause Event Listener
playBtn.addEventListener('click', () => (isPlaying ? pauseSong() : playSong()));


// Update DOM
function loadSong(song) {
  title.textContent = song.displayName;
  artist.textContent = song.artist;
  music.src = `audio/${song.name}.mp3`;
  image.src = `image/${song.name}.jpg`;
}


function prevSong() {
  songIndex--;
  if (songIndex === 0) {
    songIndex = songs.length - 1
  }
  loadSong(songs[songIndex]);
  playSong();
}


function nextSong() {
  songIndex++;
  if (songIndex >= songs.length - 1) {
    songIndex = 0;
  }
  loadSong(songs[songIndex]);
  playSong();
}


// On Load - Select First Song
loadSong(songs[songIndex]);


// Update Progress Bar & Time
function updateProgressBar(event) {
  if (isPlaying) {
    const { duration, currentTime } = event.srcElement;

    // Update progress bar
    const progressPercent = (currentTime / duration) * 100;
    progressSlider.value = progressPercent * 5;
    // To avoid having the background color to move out of sync with the thumb, add adjust when updating range input background
    const adjust = progressPercent < 50 ? 0.25 : -0.25;
    setRangeBackground(progressSlider, progressPercent + adjust);

    // Calculate display for duration / remaining
    if (durationEl.classList.contains('remaining')) {
      const { remainingMinutes, remainingSeconds } = calculateRemaining(duration, currentTime);
      // Delay switching duration element to avoid NaN
      if (remainingSeconds) {
        durationEl.textContent = `-${remainingMinutes}:${remainingSeconds}`;
      }
    } else {
      const { durationMinutes, durationSeconds } = calculateDuration(duration);
      // Delay switching duration element to avoid NaN
      if (durationSeconds) {
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
      }
    }

    // Calculate display for current
    const { currentMinutes, currentSeconds } = calculateCurrentTime(currentTime);
    currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  }
}


function calculateCurrentTime(currentTime) {
  const currentMinutes = Math.floor(currentTime / 60);
  let currentSeconds = Math.floor(currentTime % 60);
  if (currentSeconds < 10) {
    currentSeconds = `0${currentSeconds}`;
  }
  return { currentMinutes, currentSeconds };
}


function calculateRemaining(duration, currentTime) {
  const remaining = duration - currentTime;
  const remainingMinutes = Math.floor(remaining / 60);
  let remainingSeconds = Math.floor(remaining % 60);
  if (remainingSeconds < 10) {
    remainingSeconds = `0${remainingSeconds}`;
  }
  return { remainingMinutes, remainingSeconds };
}


function calculateDuration(duration) {
  const durationMinutes = Math.floor(duration / 60);
  let durationSeconds = Math.floor(duration % 60);
  if (durationSeconds < 10) {
    durationSeconds = `0${durationSeconds}`;
  }
  return { durationMinutes, durationSeconds };
}


// Set Progress Bar
function setProgressBar(event) {
  const { duration } = music;
  const newCurrentTime = duration * (event.target.value / 500);
  const { currentMinutes, currentSeconds } = calculateCurrentTime(newCurrentTime);
  currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
  setRangeBackground(event.target, event.target.value / 5);

  if (durationEl.classList.contains('remaining')) {
    const { remainingMinutes, remainingSeconds } = calculateRemaining(duration, newCurrentTime);
    // Delay switching duration element to avoid NaN
    if (remainingSeconds) {
      durationEl.textContent = `-${remainingMinutes}:${remainingSeconds}`
    }
  }
}


function setNewCurrentTime(event) {
  const { duration } = music;
  const newCurrentTime = duration * (event.target.value / 500);
  music.currentTime = newCurrentTime;
  setProgressBar(event);
}


// Set Volume & Update volume range background
function setVolumeBar(event) {
  const newVolume = event.target.value;
  music.volume = newVolume / 100;
  setRangeBackground(volumeSlider, newVolume);
}


function setRangeBackground(element, progress) {
  const lightSecondary = window.getComputedStyle(document.documentElement).getPropertyValue('--light-secondary');
  const lightRangeBg = window.getComputedStyle(document.documentElement).getPropertyValue('--light-range-bg');
  const darkSecondary = window.getComputedStyle(document.documentElement).getPropertyValue('--dark-secondary');
  const darkRangeBg = window.getComputedStyle(document.documentElement).getPropertyValue('--dark-range-bg');

  const progressBarColor = lightMode ? lightSecondary : darkSecondary;
  const rangeBgColor = lightMode ? lightRangeBg : darkRangeBg;

  element.style.background = `
  linear-gradient(
    to right, ${progressBarColor} 0%, 
    ${progressBarColor} ${progress}%, 
    ${rangeBgColor} ${progress}%, ${rangeBgColor} 100%
  )`;
}


function toggleDurationRemaining() {
  durationEl.classList.toggle('remaining');

  const { duration, currentTime } = music;
  if (durationEl.classList.contains('remaining')) {
    const { remainingMinutes, remainingSeconds } = calculateRemaining(duration, currentTime);
    durationEl.textContent = `-${remainingMinutes}:${remainingSeconds}`;
  } else {
    const { durationMinutes, durationSeconds } = calculateDuration(duration);
    durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
  }
}


// Event Listeners
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
durationEl.addEventListener('click', toggleDurationRemaining);
progressSlider.addEventListener('input', setNewCurrentTime);
volumeSlider.addEventListener('input', setVolumeBar);
