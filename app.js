// 這個檔案負責處理待辦清單的資料狀態、事件綁定與 localStorage 儲存。
const STORAGE_KEY = "todo-list-items-v1";

// 取得畫面上的關鍵元素。
const todoForm = document.getElementById("todo-form");
const todoInput = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const todoCount = document.getElementById("todo-count");

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

// 重新渲染清單內容，更新未完成項目數與空白提示。
function renderTodos() {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    emptyState.classList.remove("hidden");
  } else {
    emptyState.classList.add("hidden");
  }

  todos.forEach((todo) => {
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

// 在頁面載入時先渲染一次，讓資料與畫面同步。
renderTodos();
