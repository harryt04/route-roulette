import axios from 'axios'

export async function getRoute(
  latitude: number,
  longitude: number,
  radius: number,
  driveDuration: number,
  keywords?: string,
): Promise<Waypoint[]> {
  try {
    const response = await axios.post('/api/getRoute', {
      latitude,
      longitude,
      radius,
      driveDuration,
      keywords,
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

export interface Waypoint {
  name: string
  location: Location
}

export function constructGoogleMapsUrl(waypoints: Waypoint[]): string {
  if (!waypoints || waypoints.length === 0) return ''
  const baseUrl = 'https://www.google.com/maps/dir/?api=1'
  const origin = `${waypoints[0].location.lat},${waypoints[0].location.lng}`
  const destination = `${waypoints[waypoints.length - 1].location.lat},${waypoints[waypoints.length - 1].location.lng}`

  const waypointParams = waypoints
    .slice(1, waypoints.length - 1)
    .map((waypoint) => `${waypoint.location.lat},${waypoint.location.lng}`)
    .join('|')

  return `${baseUrl}&origin=${origin}&destination=${destination}&waypoints=${waypointParams}`
}
