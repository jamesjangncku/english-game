# 新版網站開發狀態（2026-11-16）

> 本文件僅適用於 `develop/multisubject-learning`；未合併至 `main`。

## 已讀取的 GitHub 正式題庫
- `data.js`：501 題（ScienceFusion 160、Journeys 150、Social Studies 191）。
- 題目 ID、課次參照、答案索引的初步結構檢查：無錯誤。
- `reading.js`：目前 GitHub 開發分支檔案為空，**獨立閱讀模式尚無可載入題目**。
- `data/catalog.json` 和 `data/questions.json` 存在，但目前網頁實際載入的是 `data.js`，不能將兩份 JSON 的更新誤認為已同步到網站。

## 可用的專案備份（尚未同步到 GitHub）
專案附件 `Mumu_English_Adventure_V3_2_JSON_Updated.zip` 的 `reading.js` 經本地檢查包含 2,150 題，均有閱讀短文：ScienceFusion 350、Journeys 1,500、Social Studies 300；與 GitHub 上的空白 `reading.js` 不一致。應先比較來源與版權標示，再決定是否復原這個檔案。**尚未復原或發布**。

## 開發分支功能
- 首頁科目篩選：英文、自然、社會、國文。
- 國文目前沒有已核對題庫，顯示待整理。
- 課前複習直接顯示現有題庫的題目、正解、解析與例句，不宣稱為課文原文。
- GitHub Actions 對 PR 執行語法、結構及閱讀資料檢查，不負責自動發布。

## 待辦
1. 比對並復原 GitHub 缺少的獨立閱讀題庫（經審核後）。
2. 逐題比對教材資料庫與網頁題庫；確認來源與答案。
3. 實測桌面／手機版及錯題紀錄。
4. 提供獨立預覽環境，再請使用者批准合併 `main`。

## 發布原則
未經使用者確認，不合併 `main`、不啟動正式 GitHub Pages 發布。
