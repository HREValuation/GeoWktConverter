type Coordinate = [number, number]; // [longitude, latitude]
type ConversionMode = "POINT" | "MULTIPOINT" | "LINESTRING" | "POLYGON";

/**
 * Parse coordinates from input string
 * @param input Coordinates as string in format "lon1 lat1, lon2 lat2, ..."
 * @returns Array of coordinate pairs or null if invalid
 */
export function parseCoordinates(input: string): Coordinate[] {
  const coordinates: Coordinate[] = [];
  
  // Split by commas or newlines
  const parts = input.split(/,|\n/).map(part => part.trim()).filter(part => part);
  
  for (const part of parts) {
    // Extract longitude and latitude
    const coords = part.split(/\s+/);
    if (coords.length !== 2) {
      throw new Error("Invalid coordinate format. Use 'longitude latitude' format for each point.");
    }
    
    const lon = parseFloat(coords[0]);
    const lat = parseFloat(coords[1]);
    
    // Validate numeric values
    if (isNaN(lon) || isNaN(lat)) {
      throw new Error("Coordinates must be numeric values.");
    }
    
    // Validate coordinate ranges
    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) {
      throw new Error("Coordinates out of range. Longitude must be between -180 and 180, latitude between -90 and 90.");
    }
    
    coordinates.push([lon, lat]);
  }
  
  if (coordinates.length === 0) {
    throw new Error("No valid coordinates found.");
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
    throw new Error("POLYGON requires at least 3 points.");
  }
  
  // Check if first and last points match
  const firstPoint = coordinates[0];
  const lastPoint = coordinates[coordinates.length - 1];
  
  if (firstPoint[0] !== lastPoint[0] || firstPoint[1] !== lastPoint[1]) {
    throw new Error("For POLYGON, first and last points must be identical to form a closed area.");
  }
  
  const pointsString = coordinates.map(coord => {
    return `${coord[0]} ${coord[1]}`;
  }).join(', ');
  
  return `POLYGON ((${pointsString}))`;
}

/**
 * Convert coordinates to WKT based on selected mode
 */
export function convertToWkt(coordinatesInput: string, mode: ConversionMode): string {
  const coordinates = parseCoordinates(coordinatesInput);
  
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
      throw new Error("Invalid conversion mode");
  }
}
