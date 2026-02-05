let data = JSON.parse(localStorage.getItem("navData")) || [];
let currentType = "";
let currentCategoryIndex = null;

const categoriesEl = document.getElementById("categories");
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalName = document.getElementById("modalName");
const modalUrl = document.getElementById("modalUrl");

function save() {
  localStorage.setItem("navData", JSON.stringify(data));
  render();
}

function render(filter = "") {
  categoriesEl.innerHTML = "";
  data.forEach((cat, ci) => {
    const catEl = document.createElement("div");
    catEl.className = "category";
    catEl.innerHTML = `
      <h2>${cat.name}
        <span>
          <button onclick="addBookmark(${ci})">＋</button>
          <button onclick="deleteCategory(${ci})">🗑</button>
        </span>
      </h2>
      <div class="list"></div>
    `;
    const list = catEl.querySelector(".list");
    cat.bookmarks.forEach((bm, bi) => {
      if (filter && !bm.name.includes(filter)) return;
      const bmEl = document.createElement("div");
      bmEl.className = "bookmark";
      bmEl.draggable = true;
      bmEl.innerHTML = `<img src="https://www.google.com/s2/favicons?domain=${bm.url}">${bm.name}`;
      bmEl.onclick = () => window.open(bm.url, "_blank");
      list.appendChild(bmEl);
    });
    categoriesEl.appendChild(catEl);
  });
}

function openModal(type, ci = null) {
  currentType = type;
  currentCategoryIndex = ci;
  modal.classList.remove("hidden");
  modalTitle.textContent = type === "category" ? "新分类" : "新书签";
  modalUrl.style.display = type === "bookmark" ? "block" : "none";
}

document.getElementById("saveBtn").onclick = () => {
  const name = modalName.value;
  const url = modalUrl.value;
  if (currentType === "category") {
    data.push({ name, bookmarks: [] });
  } else {
    data[currentCategoryIndex].bookmarks.push({ name, url });
  }
  modal.classList.add("hidden");
  modalName.value = modalUrl.value = "";
  save();
};

document.getElementById("cancelBtn").onclick = () => modal.classList.add("hidden");

function addBookmark(ci) { openModal("bookmark", ci); }
function deleteCategory(ci) { data.splice(ci,1); save(); }

document.getElementById("addCategoryBtn").onclick = () => openModal("category");

document.getElementById("search").oninput = e => render(e.target.value);

document.getElementById("toggleTheme").onclick = () => {
  document.body.classList.toggle("dark");
};

document.getElementById("exportData").onclick = () => {
  const blob = new Blob([JSON.stringify(data,null,2)]);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "nav.json";
  a.click();
};

document.getElementById("importBtn").onclick = () => document.getElementById("importData").click();
document.getElementById("importData").onchange = e => {
  const reader = new FileReader();
  reader.onload = () => {
    data = JSON.parse(reader.result);
    save();
  };
  reader.readAsText(e.target.files[0]);
};

setInterval(() => {
  document.getElementById("clock").textContent = new Date().toLocaleTimeString();
}, 1000);

render();
