# GeoWktConverter

將地理座標轉換為 WKT (Well-Known Text) 格式的網頁工具，支援多種座標格式與地理圖形類型。

## 功能特色

- 支援緯度/經度和經度/緯度兩種座標格式
- 支援多種 WKT 輸出類型：點 (POINT)、多點 (MULTIPOINT)、線段 (LINESTRING) 和多邊形 (POLYGON)
- 自動驗證座標格式與範圍
- 支援深色/淺色主題切換（右上角按鈕）
- 簡潔直觀的使用者介面

## 技術棧

- 純 HTML、CSS 和 JavaScript
- 無需任何框架或構建工具
- 無外部依賴，僅使用 Font Awesome 圖標

## 線上演示

[在線體驗 GeoWktConverter](https://hrewkt.zeabur.app/)
或
[在線體驗 GeoWktConverter](https://wkt.hre-tools.com)

## 本地開發與使用

無需安裝任何依賴或構建工具，直接在瀏覽器中打開 `index.html` 檔案即可使用：

```bash
# 直接打開 HTML 檔案
open index.html

# 或使用任何本地伺服器
python -m http.server
```

## 檔案結構

```
GeoWktConverter/
├── index.html      # 主頁面
├── css/
│   └── style.css   # 樣式表
├── js/
│   ├── main.js     # 主要 JavaScript 邏輯
│   └── wkt.js      # WKT 轉換邏輯
└── README.md       # 專案說明
```

## 部署

本專案為純靜態網站，可輕鬆部署於任何靜態網站託管服務，如 Netlify、Vercel、GitHub Pages 或 Zeabur 等平台。

### 部署步驟

1. 將專案推送到 GitHub 儲存庫
2. 在您選擇的託管平台上連接該儲存庫
3. 無需任何特殊設定，直接部署

由於專案是純靜態的，不需要任何構建步驟或特殊設定，部署過程非常簡單。

## 授權

MIT