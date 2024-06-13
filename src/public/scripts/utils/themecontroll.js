export default class ThemeController {
  constructor() {
    this.body = document.body;
    this.themeToggle = document.querySelector(".theme-toggle");
    this.themeIcon = document.querySelector(".theme-icon");
    this.partyTimer = null;
  }

  toggleTheme() {
    this.body.classList.toggle("dark-theme");
    if (this.body.classList.contains("dark-theme")) {
      this.themeIcon.textContent = "light_mode";
      localStorage.setItem("theme", "dark");
    } else {
      this.themeIcon.textContent = "dark_mode";
      localStorage.setItem("theme", "light");
    }
  }

  applyTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      this.body.classList.add("dark-theme");
      this.themeIcon.textContent = "light_mode";
    } else {
      this.body.classList.remove("dark-theme");
      this.themeIcon.textContent = "dark_mode";
    }
  }

  initialize() {
    this.applyTheme();
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    this.themeToggle.addEventListener("mouseover", () => {
      this.partyTimer = setTimeout(() => {
        this.body.classList.add("party");
      }, 3000);
    });

    this.themeToggle.addEventListener("mouseout", () => {
      clearTimeout(this.partyTimer);
      this.body.classList.remove("party");
    });
  }
}
