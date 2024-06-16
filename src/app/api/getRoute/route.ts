import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'
import { haversineDistanceSort } from '../../shared-utils/sorting'

export async function POST(req: NextRequest) {
  const body: any = await req.json()
  const { latitude, longitude, radius } = body // radius is in miles

  if (!latitude || !longitude || !radius) {
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
      keyword: 'scenic+viewpoint|park|tourist+attraction',
      key: apiKey,
    }
    const response = await axios.get(endpoint, { params })

    const nearbyPlaces = response.data.results

    const sorted = haversineDistanceSort(nearbyPlaces, { latitude, longitude })
    const waypoints = sorted.slice(0).map((place) => ({
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
