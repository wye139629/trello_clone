# Willo

**Demo: https://trello-clone-sigma.vercel.app/**

---

## 目錄

- [專案目的](#專案目的)
- [使用技術](#使用技術)
- [開發功能](#開發功能)
- [專案初始化](#專案初始化)
- [專案結構](#專案結構)

## 專案目的

> Willo 是一個向知名專案管理系統 Trello 致敬的專案。提供簡單的使用介面，使用者可以隨時隨地開啟新的看板，並建立分類。快速的記錄需待辦的事項，再透過拖拉的功能快速將事項一一放置分類中。

## 使用技術

- React.js
- React Query
- React DnD
- Webpack
- Tailwind CSS
- Emotion styled component
- 部署至 Vercel

## 開發功能

### 使用者

1. 註冊： 輸入信箱與密碼
2. 登入： 輸入信箱與密碼
3. 登出

### 看板

1. 瀏覽：使用者可以切換自己所創建的看板
2. 新增：可以加入標題與選擇看板背景顏色
3. 編輯：可修改看板標題

### 任務清單

1. 新增：可在看板中新增任務清單的標題
2. 編輯：

- 可修改任物清單標題
- 可拖拉修改任務清單的順序

3. 刪除：可刪除任務清單並將底下所有任務刪除

### 任務

1. 新增：可在任務清單中新增任務
2. 編輯：

- 可修改任務的標題以及編輯任務的內文
- 可拖拉任務至不同的順序或不同的任務清單

3. 刪除任務

## 專案初始化

### 建議環境

1. 安裝 Nodejs，建議版本 v14.18.1
2. 安裝 yarn 建議版本 v1.22.10

### install project

1.  Fork 專案
2.  執行 yarn install

```
$ yarn install
```

3. 啟動開發伺服器

```
$ yarn run dev
```

4. 可在 http://localhost:8080 看到網站

## 專案結構

```
trello-clone-front-end /
|
|- public/
|   |- favicon.ico
|   |- index.html
|
|- src/
|   |- components/       (底下將以每個區塊拆分資料夾)
|   |   |- __tests__/    (元件的測試，底下將以元件的資料結構分類)
|   |   |   |-shared/
|   |   |      |- Switcher.test.js
|   |   |
|   |   |- kanban/
|   |   |   |- AddButton.js
|   |   |   |- Board.js
|   |   |   |- BoardBody.js
|   |   |   ...
|   |   |
|   |   |- nav/
|   |   |   |- NavBar.js
|   |   |
|   |   |- shared/       (使用於全站的元件)
|   |   |   |- CusrtomDragLayoer.js
|   |   |   |- FullPageSpinner.js
|   |   |   |- index.js   (彙整所有 shared 的 export)
|   |   |   |- Modal.js
|   |   |   ...
|   |
|   |- contexts/
|   |   |- AppProvider.js （整合所有的 Provider）
|   |   |- authContext.js
|   |
|   |- lib/
|   |   |- api/
|   |   |   |- client.js   (axios 的設定)
|   |   |
|   |   |- data/
|   |   |   |- colors.js
|   |   |
|   |   |- fontawsome/
|   |   |   |- icons.js    (統一匯出所有的 fontawsome 圖示)
|   |   |
|   |   |- hooks
|   |   |   |- index.js     (彙整所有 hooks 的 export)
|   |   |   |- useAsync.js
|   |   |   |- useClickOutSide.js
|   |   |   |- useSafeDispatch.js
|   |   |
|   |   |- callAll.js
|   |
|   |- screens/             (全站的頁面)
|   |   |- AuthenticatedApp.js
|   |   |- KanbanScreen.js
|   |   |- UnAuthenticatedApp.js
|   |   |- WorkSpaceScreen.js
|   |
|   |- styles/
|   |   |- componentes/
|   |   |   |-shared/
|   |   |      |-Switcher.scss
|   |   |
|   |   |- global.scss
|   |
|   |- App.js
|   |- index.js
|
|- .babelrc.js
|- .env.example
|- .eslintrc.js
|- .gitignore
|- .linstagedrc.json
|- .prettierrc
|- jest.config.js
|- package.json
|- postcss.config.js
|- README.md
|- tailwind.config.js
|- vercel.json
|- webpack.config.js
|- yarn.lock
|
```
