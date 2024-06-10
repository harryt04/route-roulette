export type LatLong = {
  latitude: number
  longitude: number
}

export enum GeoLocationError {
  PERMISSION_DENIED = 'Geolocation permission denied',
}
