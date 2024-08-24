// on load function
function Load() {
  const lastTheme = localStorage.getItem("cTheme") || "theme-light";
  const body = document.querySelector("body");
  const title = document.querySelector(".theme span");

  // Apply the last saved theme
  body.className = lastTheme;
  title.innerHTML = lastTheme === "theme-dark" ? "Light" : "Dark";
  let getQuery = db.collection("todo-items");
  getItems(getQuery);
}

// change theme
function themeChanger() {
  const body = document.querySelector("body");
  const title = document.querySelector(".theme span");
  const currentTheme = body.getAttribute("class");

  // Toggle between light and dark themes
  if (currentTheme === "theme-dark") {
    body.className = "theme-light";
    title.innerHTML = "Dark";
    localStorage.setItem("cTheme", "theme-light");
  } else if (currentTheme === "theme-light") {
    body.className = "theme-dark";
    title.innerHTML = "Light";
    localStorage.setItem("cTheme", "theme-dark");
  }
}

document.addEventListener("DOMContentLoaded", Load);

// add new item
function addItem(event) {
  event.preventDefault();
  let text = document.getElementById("todo-input");

  db.collection("todo-items").add({
    text: text.value,
    status: "active",
  });
  text.value = null;
}

//sorting
function sort() {
  let sortbytags = document.querySelectorAll(".sort-by");
  sortbytags.forEach((sortbytag) => {
    sortbytag.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      sortbytag.classList.add("active");
      let activeTag = document.querySelector(".active").innerHTML;
      if (activeTag == "Completed") {
        var getQuery = db
          .collection("todo-items")
          .where("status", "==", "completed");
      } else if (activeTag == "Active") {
        var getQuery = db
          .collection("todo-items")
          .where("status", "==", "active");
      } else if (activeTag == "All") {
        var getQuery = db.collection("todo-items");
      }
      getItems(getQuery);
    });
  });
}

//get from database
function getItems(getQuery) {
  getQuery.onSnapshot((snapshot) => {
    let items = [];
    snapshot.docs.forEach((doc) => {
      items.push({
        id: doc.id,
        ...doc.data(), //spread operator
      });
    });
    generateItems(items);
  });
}

function generateItems(items) {
  let i = 0;
  let itemsHTML = "";
  items.forEach((item) => {
    itemsHTML += `
    <div class="todo-item">
      <div class="check">
        <div data-id="${item.id}" class="check-mark ${
      item.status == "completed" ? "checked" : ""
    }">
            <img src="./images/icon-check.svg">
        </div>
      </div>
      <div class="todo-text  ${item.status == "completed" ? "checked" : ""}">
          ${item.text}
      </div>
    </div>
    `;

    // items left
    if (item.status == "active") {
      i = i + 1;
      document.querySelector("#items-left").innerHTML = i;
    }
  });
  document.querySelector(".todo-items").innerHTML = itemsHTML;

  createEventListener(); // check item dynamically

  let clearBtn = document.querySelector(".items-clear");
  clearBtn.addEventListener("click", function () {
    deleteChecked(); // clear completed btn
  });
}

function createEventListener() {
  let todoCheckMarks = document.querySelectorAll(".todo-item .check-mark");
  todoCheckMarks.forEach((checkMark) => {
    checkMark.addEventListener("click", function () {
      markCompleted(checkMark.dataset.id);
    });
  });
}

function markCompleted(id) {
  // from a database
  let item = db.collection("todo-items").doc(id);

  item.get().then(function (doc) {
    if (doc.exists) {
      let status = doc.data().status;
      if (status == "active") {
        item.update({
          status: "completed",
        });
      } else if (status == "completed") {
        item.update({
          status: "active",
        });
      }
    }
  });
}

function deleteChecked() {
  let completedItems = document.querySelectorAll(".check .checked");
  completedItems.forEach((item) => {
    let id = item.dataset.id;

    let itemFromDB = db.collection("todo-items").doc(id);
    itemFromDB.get().then(function (doc) {
      if (doc.exists) {
        itemFromDB.delete().catch((error) => {
          console.error("Error removing document: ", error);
        });
      }
    });
  });
}

sort();
