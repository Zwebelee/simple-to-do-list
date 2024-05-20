// theme toggle
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon')

themeToggle.addEventListener('click', () => {
  if (themeIcon.src.includes('light_mode.svg')) {
    themeIcon.src = 'assets/dark_mode.svg';
  } else {
    themeIcon.src = 'assets/light_mode.svg';
  }
})
