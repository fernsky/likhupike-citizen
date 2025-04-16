/**
 * Represents the municipality data structure
 */
export interface Municipality {
  id: string;
  name: string;
  province: string;
  district: string;
  rightmostLatitude: number;
  leftmostLatitude: number;
  bottommostLongitude: number;
  topmostLongitude: number;
  lowestAltitude: number;
  highestAltitude: number;
  areaInSquareKilometers: number;
}

/**
 * API response format for municipality data
 */
export interface MunicipalityApiResponse {
  success: boolean;
  data: Municipality;
  message: string;
}

/**
 * Error response format
 */
export interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}
