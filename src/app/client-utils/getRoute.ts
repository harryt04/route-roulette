import axios from 'axios'

export async function getRoute(
  latitude: number,
  longitude: number,
  radius: number,
): Promise<Waypoint[]> {
  try {
    const response = await axios.post('/api/getRoute', {
      latitude,
      longitude,
      radius,
    })

    return response.data.waypoints
  } catch (error) {
    console.error('Error fetching route:', error)
    return []
  }
}

interface Location {
  lat: number
  lng: number
}

export interface CurrentLocation {
  latitude: number
  longitude: number
}

export interface Waypoint {
  name: string
  location: Location
}

export function constructGoogleMapsUrl(
  currentLocation: CurrentLocation,
  waypoints: Waypoint[],
): string {
  if (!waypoints || waypoints.length === 0) return ''
  const baseUrl = 'https://www.google.com/maps/dir/?api=1'
  const origin = `${currentLocation.latitude},${currentLocation.longitude}`
  const destination = `"${waypoints[waypoints.length - 1].name}"`

  const waypointParams = waypoints
    .slice(0, waypoints.length - 1) // exclude destination
    .map((waypoint) => `"${waypoint.name}"`)
    .join('|')

  return `${baseUrl}&origin=${origin}&destination=${destination}&waypoints=${waypointParams}`
}
