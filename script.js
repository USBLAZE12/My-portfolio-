const tabs = [...document.querySelectorAll(".nav-tab")];
const pages = [...document.querySelectorAll(".page[data-page]")];
const currentPageTitle = document.querySelector("#current-page-title");
const contactToggle = document.querySelector(".contact-toggle");
const quickContacts = document.querySelector("#quick-contacts");
const formRedirect = document.querySelector("#form-redirect");

formRedirect.value = new URL("thank-you.html", window.location.href).href;

function showPage(name) {
  const activeTab = tabs.find((tab) => tab.dataset.page === name);
  if (!activeTab) return;
  currentPageTitle.textContent = activeTab.textContent.trim();
  tabs.forEach((tab) => {
    const active = tab.dataset.page === name;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
    tab.tabIndex = active ? 0 : -1;
  });
  pages.forEach((page) => {
    const active = page.dataset.page === name;
    page.hidden = !active;
    page.classList.toggle("active", active);
  });
  history.replaceState(null, "", `#${name}`);
}

tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => showPage(tab.dataset.page));
  tab.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 : (index + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    tabs[nextIndex].focus();
    showPage(tabs[nextIndex].dataset.page);
  });
});

document.querySelectorAll("[data-go]").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPage(link.dataset.go);
    document.querySelector(".content-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

contactToggle.addEventListener("click", () => {
  const expanded = contactToggle.getAttribute("aria-expanded") === "true";
  contactToggle.setAttribute("aria-expanded", String(!expanded));
  quickContacts.hidden = expanded;
});

const initialPage = location.hash.slice(1);
if (pages.some((page) => page.dataset.page === initialPage)) showPage(initialPage);
else showPage("about");