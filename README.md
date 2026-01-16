# Bubble-map_1

## GitHub Pages 部署

此專案包含一個靜態網站，位於 `BubbleMap/`。已加入 GitHub Actions workflow 以自動部署到 GitHub Pages。

### 啟用步驟

1. 將此 repo 推送到 GitHub，並確保預設分支為 `main`。
2. 進入 **Settings → Pages**。
3. 在 **Build and deployment** 下，選擇 **Source: GitHub Actions**。
4. 之後只要推送到 `main`，網站就會自動更新。

部署完成後，網址會顯示在 Actions 的 `Deploy` 任務輸出中。
