# ⚡ CYBER TYPING ⚡ - 學生打字速度挑戰排行榜

`CYBER TYPING` 是一個具有極致科技感、賽博朋克（Cyberpunk）風格的學生打字速度測速挑戰排行榜系統。專案基於 **Next.js**、**Tailwind CSS v4** 與 **TypeScript** 進行開發，整合了動態雷達掃描、霓虹發光字體、電子街機掃描線等視覺特效，帶給使用者沉浸式的未來終端機體驗。

---

## 🚀 專案特點與功能

### 1. 未來科幻風視覺設計 (UI/UX)
- **科幻網格背景 (Grid Pattern)**：以極暗科技灰黑為底，點綴青色（Cyan）的細緻發光網格與徑向發光漸層。
- **雷達掃描動畫 (Radar Sweep)**：不斷在螢幕上垂直循環移動的綠色/青色漸層雷達線。
- **霓虹發光字體 (Neon Glow)**：針對標題與前三名排名加入 CSS Text-Shadow 發光特效。
- **街機掃描線遮罩 (Scanline Effect)**：固定於螢幕最上層的透明黑格掃描線，還原懷舊陰極射線管（CRT）螢幕質感。

### 2. 打字數據輸入控制台 (Terminal Input)
- 支援輸入測速學生的姓名（最長 15 個字元）。
- 支援輸入打字速度 WPM（Words Per Minute，每分鐘字數），自動防呆驗證防止無效輸入。
- 寫入資料時具有寫入緩衝提示與動態成功/失敗的狀態回饋。

### 3. 終端高速處理排行榜 (Speed Demon Directory)
- **自動即時排序**：排行榜所有數據依打字速度（WPM）由高至低自動即時進行排序。
- **前三名專屬高亮**：
  - **🥇 第一名**：翡翠綠（Emerald）發光邊框、專屬 `TOP` 標籤與綠色霓虹文字。
  - **🥈 第二名**：天空藍（Sky）發光邊框與青色霓虹文字。
  - **🥉 第三名**：幽蘭紫（Purple）發光邊框。
- **資料手動刪除**：附帶防手殘點錯的 `confirm` 確認彈窗，一鍵快速從資料庫中清除歷史紀錄。
- **一鍵手動重整**：支援 `🔄 重整緩衝` 按鈕手動向伺服器拉取最新排行資料。

---

## 🛠️ 技術棧 (Technology Stack)

- **前端框架**：[Next.js 15+ (App Router)](https://nextjs.org/)
- **樣式工具**：[Tailwind CSS v4](https://tailwindcss.com/) (搭配 `@tailwindcss/postcss` 進行優雅的漸進式載入)
- **開發語言**：[TypeScript](https://www.typescriptlang.org/)
- **核心庫**：React 19 (React Hooks, Client Components)

---

## 📂 專案檔案結構說明

```text
├── app/
│   ├── api/
│   │   └── scores/
│   │       └── route.ts      # 排行榜後端 API 路由 (GET, POST, DELETE)
│   ├── globals.css           # 全域樣式、霓虹字體、雷達線與網格特效定義
│   ├── layout.tsx            # Next.js 全域 Layout
│   └── page.tsx              # 前端主控制面板與排行榜介面 (Client Component)
├── public/                   # 靜態資源與向量圖標
├── package.json              # 專案依賴與腳本定義
├── tsconfig.json             # TypeScript 配置檔
└── tailwind.config.js        # Tailwind CSS 配置
```

---

## 🔌 API 規格說明 (REST API)

後端路由位於 `/app/api/scores/route.ts`，採用記憶體緩衝區（In-Memory Array）動態儲存數據，免除繁瑣的資料庫設定。

### 1. 取得排行榜清單 (GET)
- **網址**：`/api/scores`
- **說明**：回傳完整打字排行榜資料，並已自動依速度（WPM）由高到低排序。
- **回傳範例 (JSON)**：
  ```json
  [
    {
      "id": "1",
      "name": "王小明 ⌨️",
      "score": 128,
      "date": "2026-05-23T03:47:49.123Z"
    },
    {
      "id": "2",
      "name": "李阿華 ⚡",
      "score": 105,
      "date": "2026-05-23T03:47:49.123Z"
    }
  ]
  ```

### 2. 登錄打字速度成績 (POST)
- **網址**：`/api/scores`
- **說明**：新增一筆測速紀錄。
- **請求參數 (JSON Body)**：
  | 欄位 | 型態 | 必填 | 說明 |
  | :--- | :--- | :--- | :--- |
  | `name` | string | 是 | 學生名稱 (不能為空) |
  | `score` | number | 是 | 打字速度 (WPM)，必須為大於或等於 0 的正整數 |
- **請求範例**：
  ```json
  {
    "name": "陳鐵人",
    "score": 95
  }
  ```
- **回傳範例 (201 Created)**：
  ```json
  {
    "id": "1716445123456",
    "name": "陳鐵人",
    "score": 95,
    "date": "2026-05-23T03:47:55.000Z"
  }
  ```

### 3. 刪除測速紀錄 (DELETE)
- **網址**：`/api/scores?id={id}`
- **說明**：依據指定的 ID 刪除該筆排行紀錄。
- **Query 參數**：
  - `id`: 要刪除的紀錄唯一識別碼。
- **回傳範例 (200 OK)**：
  ```json
  {
    "success": true,
    "message": "資料已成功刪除！"
  }
  ```

---

## 🏃 快速上手 (Local Development)

請依照下列步驟在您的本機環境啟動專案：

### 1. 安裝依賴套件
```bash
npm install
```

### 2. 啟動開發伺服器
```bash
npm run dev
```

### 3. 瀏覽專案
打開瀏覽器，前往 [http://localhost:3000](http://localhost:3000) 即可進入 **CYBER TYPING** 控制中心！

---

## 📈 未來擴充計畫 (Roadmap)
- [ ] **歷史數據持久化**：串接 MongoDB 或 PostgreSQL，讓學生打字成績能永久儲存。
- [ ] **打字練習小遊戲**：內建打字測速小遊戲，學生可直接在頁面上測速並即時將成績上傳登錄。
- [ ] **班級與組別篩選**：支援分班、分組排行榜，方便老師進行多班級的管理與競賽。
