type Coordinate = [number, number]; // [longitude, latitude]
type ConversionMode = "POINT" | "MULTIPOINT" | "LINESTRING" | "POLYGON";
export type CoordinateFormat = "LONG_LAT" | "LAT_LONG"; // 座標格式: 經度,緯度 或 緯度,經度

/**
 * Parse coordinates from input string
 * @param input Coordinates as string in format "lon1 lat1, lon2 lat2, ..." or "lat1 lon1, lat2 lon2, ..."
 * @param format Coordinate format (LONG_LAT or LAT_LONG)
 * @returns Array of coordinate pairs or null if invalid
 */
export function parseCoordinates(input: string, format: CoordinateFormat = "LONG_LAT"): Coordinate[] {
  const coordinates: Coordinate[] = [];
  
  // Split by commas or newlines
  const parts = input.split(/,|\n/).map(part => part.trim()).filter(part => part);
  
  for (const part of parts) {
    // Extract values
    const coords = part.split(/\s+/);
    if (coords.length !== 2) {
      throw new Error("座標格式無效。請使用 '數值1 數值2' 的格式表示每個點。");
    }
    
    // Parse as numbers
    const value1 = parseFloat(coords[0]);
    const value2 = parseFloat(coords[1]);
    
    // Validate numeric values
    if (isNaN(value1) || isNaN(value2)) {
      throw new Error("座標必須是數值。");
    }
    
    // Determine which is longitude and which is latitude based on format
    let lon: number, lat: number;
    
    if (format === "LONG_LAT") {
      lon = value1;
      lat = value2;
    } else { // LAT_LONG
      lat = value1;
      lon = value2;
    }
    
    // Validate coordinate ranges
    if (lon < -180 || lon > 180) {
      throw new Error("經度超出範圍。經度必須在 -180 到 180 之間。");
    }
    
    if (lat < -90 || lat > 90) {
      throw new Error("緯度超出範圍。緯度必須在 -90 到 90 之間。");
    }
    
    // Always store as [longitude, latitude] for WKT standards
    coordinates.push([lon, lat]);
  }
  
  if (coordinates.length === 0) {
    throw new Error("未找到有效座標。");
  }
  
  return coordinates;
}

/**
 * Format coordinates as POINT
 */
function formatAsPoints(coordinates: Coordinate[]): string {
  return coordinates.map(coord => {
    return `POINT (${coord[0]} ${coord[1]})`;
  }).join('\n');
}

/**
 * Format coordinates as MULTIPOINT
 */
function formatAsMultipoint(coordinates: Coordinate[]): string {
  const pointsString = coordinates.map(coord => {
    return `(${coord[0]} ${coord[1]})`;
  }).join(', ');
  
  return `MULTIPOINT (${pointsString})`;
}

/**
 * Format coordinates as LINESTRING
 */
function formatAsLinestring(coordinates: Coordinate[]): string {
  if (coordinates.length < 2) {
    throw new Error("LINESTRING requires at least 2 points.");
  }
  
  const pointsString = coordinates.map(coord => {
    return `${coord[0]} ${coord[1]}`;
  }).join(', ');
  
  return `LINESTRING (${pointsString})`;
}

/**
 * Format coordinates as POLYGON
 */
function formatAsPolygon(coordinates: Coordinate[]): string {
  if (coordinates.length < 3) {
    throw new Error("多邊形（POLYGON）需要至少 3 個點。");
  }
  
  // Check if first and last points match
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
 * Convert coordinates to WKT based on selected mode and format
 * @param coordinatesInput Input string with coordinates
 * @param mode WKT conversion mode
 * @param format Format of coordinates (LAT_LONG or LONG_LAT)
 * @returns WKT formatted string
 */
export function convertToWkt(
  coordinatesInput: string, 
  mode: ConversionMode,
  format: CoordinateFormat = "LAT_LONG" // 預設為緯度,經度格式 (Google Maps 兼容)
): string {
  const coordinates = parseCoordinates(coordinatesInput, format);
  
  switch (mode) {
    case "POINT":
      return formatAsPoints(coordinates);
    case "MULTIPOINT":
      return formatAsMultipoint(coordinates);
    case "LINESTRING":
      return formatAsLinestring(coordinates);
    case "POLYGON":
      return formatAsPolygon(coordinates);
    default:
      throw new Error("無效的轉換模式");
  }
}
