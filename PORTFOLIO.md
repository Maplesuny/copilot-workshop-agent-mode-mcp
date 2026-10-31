![工作坊完成徽章](https://img.shields.io/badge/GitHub_Copilot_實戰工作坊-已完成-1F883D?style=for-the-badge&logo=githubcopilot&logoColor=white)
# 待辦清單 Web App

這是在 GitHub Copilot 實戰工作坊完成的待辦清單 Web App。專案以原生網頁技術實作日常待辦管理，並透過 GitHub Copilot Agent Mode、MCP 與可重複使用的提示流程，練習將需求轉成可檢查的程式修改。

## 線上展示
https://maplesuny.github.io/copilot-workshop-agent-mode-mcp/
## 功能

- 新增待辦事項，並略過空白內容。
- 標記待辦為已完成或未完成；已完成項目會以刪除線呈現。
- 刪除單筆待辦事項。
- 依全部、未完成或已完成篩選清單。
- 顯示目前未完成項目數量。
- 一次清除所有已完成項目；清除前會要求確認，沒有已完成項目時按鈕會隱藏。
- 切換深色與淺色模式；初次使用時依照作業系統偏好設定主題，手動選擇後會記住偏好。
- 將待辦資料保存在瀏覽器 `localStorage`，重新整理後仍可保留。
- 支援窄螢幕版面，並可不依賴外部 CDN 使用。

## 技術

使用純 HTML、CSS 與原生 JavaScript，沒有引入框架或套件。待辦資料與主題偏好儲存在瀏覽器 `localStorage`；樣式以 CSS 變數管理色彩，頁面不需外部 CDN 或建置流程。

## 開發方式

此專案在 GitHub Copilot 實戰工作坊中，透過 GitHub Copilot Agent Mode 協助處理待辦清單需求與程式修改。GitHub MCP 用於讀取 GitHub Issue，讓需求內容能納入工作流程。

`.github/prompts/fix-issue.prompt.md` 將 issue 處理流程整理成可重複使用的步驟，涵蓋讀取 issue、提出計畫並等待確認、建立分支、修改與驗證，以及提交、推送和建立 Pull Request。`.github/copilot-instructions.md` 則記錄專案的技術與程式規則，讓 Agent 的修改符合本專案限制。流程中的確認關卡保留由人決定是否開始修改的控制權。

## 我學到什麼

- 把預期行為、邊界情況與驗收方式寫清楚，有助於 Agent 產出可檢查的修改。
- 讓 Agent 先提出計畫並等待確認，可以控制修改範圍。
- MCP 能把 GitHub Issue 等外部工作脈絡帶進開發流程。
- 更新畫面時也要同步更新 `localStorage` 與計數，避免資料和 UI 不一致。
- 語法檢查不能取代互動驗證；確認對話框、篩選與重新載入等流程仍需實際測試。
