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
  document.body.classList.toggle("dark-mode");
}

function filterList() {
  const filter = window.location.hash;
  filterButtons
    .querySelectorAll(".navbar__button")
    .forEach((el) => el.classList.remove("active"));
  filterButtons.querySelector(`[href="${filter}"]`).classList.add("active");
  renderExtensionList();
}

async function init() {
  try {
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
