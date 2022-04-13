const toggleSwitch = document.querySelector('input[type="checkbox"]');
const toggleIcon = document.getElementById('toggle-icon');
const textBox = document.getElementById('text-box');
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


music.volume = 0.3;
setRangeBackground(volumeSlider, music.volume * 100);
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
  music.currentTime = newCurrentTime;
  setRangeBackground(event.target, event.target.value / 5);
}


// Set Volume & Update volume range background
function setVolumeBar(event) {
  const newVolume = event.target.value;
  music.volume = newVolume / 100;
  setRangeBackground(volumeSlider, newVolume);
}


function setRangeBackground(element, progress) {
  const secondary = window.getComputedStyle(document.documentElement).getPropertyValue('--secondary');
  const rangeBg = window.getComputedStyle(document.documentElement).getPropertyValue('--range-background');

  element.style.background = `
    linear-gradient(
      to right, ${secondary} 0%, 
      ${secondary} ${progress}%, 
      ${rangeBg} ${progress}%, ${rangeBg} 100%
    )
  `;
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


// Toggle Dark / Light Mode Styles
function toggleMode(theme) {
  const lightMode = theme === 'light';
  const currentIcon = lightMode ? 'fa-moon' : 'fa-sun';
  const newIcon = lightMode ? 'fa-sun' : 'fa-moon';

  toggleIcon.children[0].textContent = `${theme.replace(/^\w/, c => c.toUpperCase())} Mode`;
  toggleIcon.children[1].classList.replace(currentIcon, newIcon);
  setRangeBackground(progressSlider, progressSlider.value / 5);
  setRangeBackground(volumeSlider, volumeSlider.value);
}


// Switch Theme Dynamically
function switchTheme(event) {
  if (event.target.checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
    toggleMode('dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
    toggleMode('light');
  }
}


// Event Listeners
toggleSwitch.addEventListener('change', switchTheme);
prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);
music.addEventListener('ended', nextSong);
music.addEventListener('timeupdate', updateProgressBar);
durationEl.addEventListener('click', toggleDurationRemaining);
progressSlider.addEventListener('input', setProgressBar);
volumeSlider.addEventListener('input', setVolumeBar);

// Check Local Storage For Theme
const currentTheme = localStorage.getItem('theme');
if (currentTheme) {
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (currentTheme === 'dark') {
    toggleSwitch.checked = true;
    setMode('dark');
  }
}