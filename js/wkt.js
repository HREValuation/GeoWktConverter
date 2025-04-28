/**
 * 座標類型定義
 * @typedef {[number, number]} Coordinate - [longitude, latitude]
 */

/**
 * 轉換模式類型定義
 * @typedef {'POINT' | 'MULTIPOINT' | 'LINESTRING' | 'POLYGON'} ConversionMode
 */

/**
 * 座標格式類型定義
 * @typedef {'LONG_LAT' | 'LAT_LONG'} CoordinateFormat - 經度,緯度 或 緯度,經度
 */

/**
 * 解析座標字串
 * @param {string} input - 座標輸入字串
 * @param {CoordinateFormat} format - 座標格式 (LONG_LAT 或 LAT_LONG)
 * @returns {Coordinate[]} - 解析後的座標陣列
 */
function parseCoordinates(input, format = 'LAT_LONG') {
  const coordinates = [];
  
  // 先將輸入按換行符分割成多行
  const lines = input.split(/\n/).map(line => line.trim()).filter(line => line);
  
  // 處理每一行
  for (const line of lines) {
    // 處理多種格式的情況
    let pointPairs = [];
    
    // 檢查該行是否有 "數值,數值" 的格式 (單對座標)，例如 "25.037571,121.557846"
    if (line.match(/^[\d.-]+,[\d.-]+$/)) {
      // 這是單一座標對，直接處理
      pointPairs = [line];
    } else {
      // 可能是多個點以逗號分隔，如 "25.1234 121.5678, 25.1235 121.5679" 
      // 或多個以逗號分隔的點對 "25.1234,121.5678, 25.1235,121.5679"
      pointPairs = line.split(/\s*,\s*/).filter(p => p);
    }
    
    for (const pointPair of pointPairs) {
      let value1, value2;
      
      // 嘗試解析座標對
      if (pointPair.includes(',')) {
        // 如果座標對內有逗號 (e.g. "25.1234,121.5678")
        const parts = pointPair.split(',').map(p => p.trim());
        if (parts.length !== 2) {
          throw new Error(`座標格式無效: "${pointPair}"。應為 "數值1,數值2" 或 "數值1 數值2"`);
        }
        value1 = parseFloat(parts[0]);
        value2 = parseFloat(parts[1]);
      } else {
        // 如果座標對內用空格分隔 (e.g. "25.1234 121.5678")
        const parts = pointPair.split(/\s+/);
        if (parts.length !== 2) {
          throw new Error(`座標格式無效: "${pointPair}"。應為 "數值1,數值2" 或 "數值1 數值2"`);
        }
        value1 = parseFloat(parts[0]);
        value2 = parseFloat(parts[1]);
      }
      
      // 驗證座標值是否為數字
      if (isNaN(value1) || isNaN(value2)) {
        throw new Error("座標必須是數值。");
      }
      
      // 根據格式確定哪個是經度哪個是緯度
      let lon, lat;
      
      if (format === 'LONG_LAT') {
        lon = value1;
        lat = value2;
      } else { // LAT_LONG
        lat = value1;
        lon = value2;
      }
      
      // 驗證座標範圍
      if (lon < -180 || lon > 180) {
        throw new Error(`經度 ${lon} 超出範圍。經度必須在 -180 到 180 之間。`);
      }
      
      if (lat < -90 || lat > 90) {
        throw new Error(`緯度 ${lat} 超出範圍。緯度必須在 -90 到 90 之間。`);
      }
      
      // 符合 WKT 標準的儲存格式 [longitude, latitude]
      coordinates.push([lon, lat]);
    }
  }
  
  if (coordinates.length === 0) {
    throw new Error("未找到有效座標。");
  }
  
  return coordinates;
}

/**
 * 將座標格式化為 POINT
 * @param {Coordinate[]} coordinates - 座標陣列
 * @returns {string} - WKT 格式字串
 */
function formatAsPoints(coordinates) {
  return coordinates.map(coord => {
    return `POINT (${coord[0]} ${coord[1]})`;
  }).join('\n');
}

/**
 * 將座標格式化為 MULTIPOINT
 * @param {Coordinate[]} coordinates - 座標陣列
 * @returns {string} - WKT 格式字串
 */
function formatAsMultipoint(coordinates) {
  const pointsString = coordinates.map(coord => {
    return `(${coord[0]} ${coord[1]})`;
  }).join(', ');
  
  return `MULTIPOINT (${pointsString})`;
}

/**
 * 將座標格式化為 LINESTRING
 * @param {Coordinate[]} coordinates - 座標陣列
 * @returns {string} - WKT 格式字串
 */
function formatAsLinestring(coordinates) {
  if (coordinates.length < 2) {
    throw new Error("線段（LINESTRING）需要至少 2 個點。");
  }
  
  const pointsString = coordinates.map(coord => {
    return `${coord[0]} ${coord[1]}`;
  }).join(', ');
  
  return `LINESTRING (${pointsString})`;
}

/**
 * 將座標格式化為 POLYGON
 * @param {Coordinate[]} coordinates - 座標陣列
 * @returns {string} - WKT 格式字串
 */
function formatAsPolygon(coordinates) {
  if (coordinates.length < 3) {
    throw new Error("多邊形（POLYGON）需要至少 3 個點。");
  }
  
  // 檢查首尾點是否相同
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  
  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    throw new Error("多邊形（POLYGON）的第一個點和最後一個點必須相同，以形成封閉區域。");
  }
  
  const pointsString = coordinates.map(coord => {
    return `${coord[0]} ${coord[1]}`;
  }).join(', ');
  
  return `POLYGON ((${pointsString}))`;
}

/**
 * 將座標轉換為 WKT 格式
 * @param {string} coordinatesInput - 座標輸入字串
 * @param {ConversionMode} mode - 轉換模式
 * @param {CoordinateFormat} format - 座標格式 (LAT_LONG 或 LONG_LAT)
 * @returns {string} - WKT 格式字串
 */
function convertToWkt(coordinatesInput, mode, format = 'LAT_LONG') {
  const coordinates = parseCoordinates(coordinatesInput, format);
  
  switch (mode) {
    case 'POINT':
      return formatAsPoints(coordinates);
    case 'MULTIPOINT':
      return formatAsMultipoint(coordinates);
    case 'LINESTRING':
      return formatAsLinestring(coordinates);
    case 'POLYGON':
      return formatAsPolygon(coordinates);
    default:
      throw new Error("無效的轉換模式");
  }
}
