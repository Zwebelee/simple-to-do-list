export default class ThemeController {
  constructor() {
    this.body = document.body;
    this.themeToggle = document.querySelector(".theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
  }

  toggleTheme() {
    this.body.classList.toggle("dark-theme");
    if (this.body.classList.contains("dark-theme")) {
      this.themeIcon.src = "assets/dark_mode.svg";
      localStorage.setItem("theme", "dark");
    } else {
      this.themeIcon.src = "assets/light_mode.svg";
      localStorage.setItem("theme", "light");
    }
  }

  applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.body.classList.add("dark-theme");
      this.themeIcon.src = "assets/dark_mode.svg";
    } else {
      this.body.classList.remove("dark-theme");
      this.themeIcon.src = "assets/light_mode.svg";
    }
  }

  initialize() {
    this.applyTheme();
    this.themeToggle.addEventListener("click", () => this.toggleTheme());
  }
}
