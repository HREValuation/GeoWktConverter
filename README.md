# GeoWktConverter
將地理座標轉換為 WKT (Well-Known Text) 格式的網頁工具，支援多種座標格式與地理圖形類型。

## 功能特色

- 支援緯度/經度和經度/緯度兩種座標格式
- 支援多種 WKT 輸出類型：點 (POINT)、多點 (MULTIPOINT)、線段 (LINESTRING) 和多邊形 (POLYGON)
- 自動驗證座標格式與範圍
- 支援深色/淺色主題切換
- 簡潔直觀的使用者介面

## 技術棧

- React + TypeScript
- Tailwind CSS + Shadcn UI
- Vite 建置工具

## 線上演示

[在線體驗 GeoWktConverter](https://您的部署網址)

## 本地開發

```bash
# 安裝依賴
cd client
npm install

# 啟動開發伺服器
npm run dev

# 建置生產版本
npm run build