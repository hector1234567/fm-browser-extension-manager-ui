const divExtensionList = document.querySelector(".extension-list");
const darkModeBtn = document.querySelector(".header__dark-mode-btn");
const filterButtons = document.querySelector(".navbar__buttons");

let extensionList = [];

function renderExtensionList() {
  const filter = window.location.hash;

  const html = extensionList
    .map((extension, id) => {
      const { logo, name, description, isActive, deleted } = extension;
      if (deleted) return;

      if (
        filter === "#all" ||
        (filter === "#active" && isActive) ||
        (filter === "#inactive" && !isActive)
      ) {
        return `
          <article class="extension" data-id="${id}">
            <div class="extension__content">
              <figure class="extension__icon">
                <img src="${logo}" alt="${name}" />
              </figure>
              <div class="extension__text">
                <h2>${name}</h2>
                <p>${description}</p>
              </div>
            </div>
            <div class="extension__buttons">
              <button class="extension__button">Remove</button>
              <div class="extension__switch${
                isActive ? " active" : ""
              }" tabindex="0"></div>
            </div>
          </article>`;
      }
    })
    .join("");

  divExtensionList.innerHTML = html;
}

function handleClickExtensionList(ev) {
  const id = ev.target.closest(".extension").dataset.id;
  if (!id) return;

  if (ev.target.closest(".extension__button")) {
    extensionList[id].deleted = true;
  } else if (ev.target.closest(".extension__switch")) {
    extensionList[id].isActive = !extensionList[id].isActive;
  }
  renderExtensionList();
}

function handleChangeDarkMode() {
  if (document.body.classList.contains("dark-mode")) {
    localStorage.removeItem("dark-mode");
  } else {
    localStorage.setItem("dark-mode", "true");
  }

  switchDarkMode();
}

function filterList() {
  const filter = window.location.hash;
  filterButtons
    .querySelectorAll(".navbar__button")
    .forEach((el) => el.classList.remove("active"));
  const activeButton = filterButtons.querySelector(`[href="${filter}"]`);
  if (!activeButton) return;
  activeButton.classList.add("active");
  renderExtensionList();
}

function switchDarkMode() {
  if (localStorage.getItem("dark-mode")) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}

async function init() {
  try {
    switchDarkMode();
    const res = await fetch("/data.json");
    extensionList = await res.json();
    filterList();

    divExtensionList.addEventListener("click", handleClickExtensionList);
    window.addEventListener("hashchange", filterList);
    darkModeBtn.addEventListener("click", handleChangeDarkMode);
  } catch (e) {
    console.error(e.message);
  }
}
init();
