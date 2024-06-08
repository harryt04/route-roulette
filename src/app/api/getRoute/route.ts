import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body: any = await req.json()
  const { latitude, longitude, radius, driveDuration, keywords } = body // radius is in miles

  if (!latitude || !longitude || !radius || !driveDuration) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 },
    )
  }

  const endpoint = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  try {
    const params = {
      location: `${latitude},${longitude}`,
      radius: radius * 1609.34, // Convert miles to meters
      keyword: keywords || 'scenic',
      key: apiKey,
    }
    const response = await axios.get(endpoint, { params })

    const nearbyPlaces = response.data.results

    // Function to calculate the distance between two coordinates using the Haversine formula
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

    // Sort places by distance from the origin
    nearbyPlaces.sort((a, b) => {
      const distanceA = haversineDistance(
        latitude,
        longitude,
        a.geometry.location.lat,
        a.geometry.location.lng,
      )
      const distanceB = haversineDistance(
        latitude,
        longitude,
        b.geometry.location.lat,
        b.geometry.location.lng,
      )
      return distanceA - distanceB
    })

    // Select the nearest waypoints
    const waypoints = nearbyPlaces.slice(0).map((place) => ({
      name: place.name,
      location: place.geometry.location,
    }))

    return NextResponse.json({ waypoints }, { status: 200 })
  } catch (error) {
    console.error('Error fetching nearby scenic locations:', error)
    return NextResponse.json(
      { error: 'Error fetching nearby scenic locations' },
      { status: 500 },
    )
  }
}
