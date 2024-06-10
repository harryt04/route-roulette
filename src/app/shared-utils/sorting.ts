import { LatLong } from '../types/location'

/**
 * Calculates the haversine distance between two points on the Earth's surface.
 * @param {number} lat1 - The latitude of the first point.
 * @param {number} lon1 - The longitude of the first point.
 * @param {number} lat2 - The latitude of the second point.
 * @param {number} lon2 - The longitude of the second point.
 * @returns {number} The haversine distance between the two points in kilometers.
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const toRadians = (angle) => angle * (Math.PI / 180)
  const R = 6371 // Earth's radius in kilometers

  const dLat = toRadians(lat2 - lat1)
  const dLon = toRadians(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Sorts an array of objects by their haversine distance from a given location.
 * @param arrayToSort - The array of objects to be sorted.
 * @param currentLocation - The current location as a latitude-longitude pair.
 * @returns A new array with the objects sorted by their distance from the current location.
 */
export const haversineDistanceSort = (
  arrayToSort: any[],
  currentLocation: LatLong,
) => {
  // Sort places by distance from the origin
  const copy = [...arrayToSort]
  copy.sort((a, b) => {
    const distanceA = haversineDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      a.geometry.location.lat,
      a.geometry.location.lng,
    )
    const distanceB = haversineDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      b.geometry.location.lat,
      b.geometry.location.lng,
    )
    return distanceA - distanceB
  })
  return copy
}
