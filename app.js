// 這個檔案負責處理待辦清單的資料狀態、事件綁定、篩選邏輯與 localStorage 儲存。
const STORAGE_KEY = "todo-list-items-v1";
const THEME_KEY = "todo-theme-preference";

// 取得畫面上的關鍵元素。
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const todoCount = document.getElementById("todo-count");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const themeText = document.querySelector(".theme-text");
const filterButtons = document.querySelectorAll(".filter-btn");

// 目前的篩選狀態，預設為全部資料。
let currentFilter = "all";

// 先從 localStorage 讀取待辦資料，若沒有則使用空陣列。
let todos = loadTodos();

// 讀取本地資料，避免在資料格式錯誤時直接拋錯。
function loadTodos() {
  try {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    return savedTodos ? JSON.parse(savedTodos) : [];
  } catch (error) {
    console.error("讀取待辦資料失敗:", error);
    return [];
  }
}

// 將待辦資料保存到 localStorage，確保重新整理後仍保留資料。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 取得目前的主題設定：若使用者從未手動選擇，就依照系統偏好。
function getPreferredTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// 套用深淺色主題，並同步切換按鈕文字與圖示。
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const isDark = theme === "dark";

  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeText.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "切換至淺色模式" : "切換至深色模式"
  );
}

// 依照系統偏好或已儲存設定，初始化主題狀態。
function initializeTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);

  // 如果使用者沒有手動設定，則跟隨操作系統的深淺色設定即時更新。
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  mediaQuery.addEventListener("change", (event) => {
    if (!localStorage.getItem(THEME_KEY)) {
      applyTheme(event.matches ? "dark" : "light");
    }
  });
}

// 將目前篩選的資料回傳，供渲染使用。
function getFilteredTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 依照目前篩選狀態，設定空白提示內容。
function getEmptyMessage() {
  if (currentFilter === "active") {
    return "目前沒有未完成的待辦事項";
  }

  if (currentFilter === "completed") {
    return "目前沒有已完成的待辦事項";
  }

  return "還沒有任何待辦事項,新增一個吧!";
}

// 重新渲染清單內容，更新未完成項目數與空白提示。
function renderTodos() {
  todoList.innerHTML = "";

  const visibleTodos = getFilteredTodos();

  if (visibleTodos.length === 0) {
    emptyState.textContent = getEmptyMessage();
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  visibleTodos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item ${todo.completed ? "completed" : ""}`;
    item.dataset.todoId = String(todo.id);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `標記 ${todo.text} 為完成`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-btn";
    deleteButton.textContent = "✕";
    deleteButton.setAttribute("aria-label", `刪除 ${todo.text}`);

    item.appendChild(checkbox);
    item.appendChild(text);
    item.appendChild(deleteButton);
    todoList.appendChild(item);
  });

  const incompleteCount = todos.filter((todo) => !todo.completed).length;
  todoCount.textContent = `未完成: ${incompleteCount} 項`;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("active", isActive);
  });
}

// 新增待辦事項，輸入空白字串時不做任何事。
todoForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = todoInput.value.trim();
  if (!value) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: Date.now() + Math.random(),
    text: value,
    completed: false,
  });

  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
});

// 切換主題，並將使用者選擇存進 localStorage。
themeToggle.addEventListener("click", () => {
  const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(THEME_KEY, nextTheme);
  applyTheme(nextTheme);
});

// 監聽篩選按鈕點擊，更新目前顯示類型。
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

// 監聽清單的勾選事件，切換完成狀態並更新樣式與計數。
todoList.addEventListener("change", (event) => {
  const target = event.target;

  if (target.matches("input[type='checkbox']")) {
    const item = target.closest(".todo-item");
    const todoId = Number(item.dataset.todoId);

    todos = todos.map((todo) => {
      if (todo.id === todoId) {
        return { ...todo, completed: target.checked };
      }
      return todo;
    });

    saveTodos();
    renderTodos();
  }
});

// 監聽刪除按鈕點擊，移除該筆待辦。
todoList.addEventListener("click", (event) => {
  const target = event.target;

  if (target.matches(".delete-btn")) {
    const item = target.closest(".todo-item");
    const todoId = Number(item.dataset.todoId);

    todos = todos.filter((todo) => todo.id !== todoId);
    saveTodos();
    renderTodos();
  }
});

// 在頁面載入時先初始化主題與渲染一次，讓資料與畫面同步。
initializeTheme();
renderTodos();
