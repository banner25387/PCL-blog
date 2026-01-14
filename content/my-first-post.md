---
title: Blog架設
date: 2026-01-14
tags: [測試, Quartz]
---

# Blog 架設紀錄：選用 Quartz

## 目標

使用 Claude 以手把手方式帶我從零建置 blog，並以 Quartz 作為 Obsidian 筆記發布的工具。

## 前置思考

我先請 Claude 分析應該使用 Obsidian 或 Notion 建置 blog，最後暫訂使用 Obsidian。

在取得建議後，我提供的提示如下（原意保留，語句整理）：

> 我沒有聽過 Quartz，但我可以試試看。只是我之前嘗試使用 Digital Garden 架設時，一開始就遇到問題，所以至今仍未完成。  
> 我想從 Quartz 重新開始。我希望你給我的指令可以一步一步來，不要一次給我太多資訊。可以像一般電腦課程那樣手把手帶我安裝嗎？架設完成大概要多久？我的電腦是 AMD 系統的 CPU 與顯卡。

Claude 對話連結：  
https://claude.ai/share/b7ada661-0d4b-4069-90a3-836c1d1a78f2

## 建置進度

- 2026-01-14 完成架設
- 後續進行少量內容調整

## 發文與上傳流程

1. 在 `content` 資料夾新增貼文（`.md` 檔）。
2. 在本機確認內容無誤後，推送到 GitHub。
3. GitHub Actions 會自動在雲端建置與部署。

## 文章範本（含功能測試）

（發文時可直接複製以下段落作為起手式）

## 測試功能

- 這是項目符號
- 可以列出清單

## 程式碼測試


```bash

# 0. 打開命令提示字元，然後更換資料夾

cd C:\Users\User\iCloudDrive\iCloud~md~obsidian\PCLblog\PCLblog\quartz-blog\quartz

# 1. 在 content 資料夾新增 .md 檔案（用記事本或任何編輯器）

# 2. 推送到 GitHub
git add .
git commit -m "Add new post"
git push origin v4

# 3. GitHub Actions 會自動在雲端建置和部署

```





