import axios from 'axios'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body: any = await req.json()
  const { latitude, longitude, radius, numWaypoints, driveDuration, keywords } =
    body

  if (!latitude || !longitude || !radius || !numWaypoints || !driveDuration) {
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
      radius: radius * 1000,
      keyword: keywords || 'scenic',
      key: apiKey,
    }
    const response = await axios.get(endpoint, {
      params,
    })

    // Process the response to extract waypoints based on the drive duration and number of waypoints required

    // For demonstration purposes, assuming response.data.results contains an array of nearby places

    const nearbyPlaces = response.data.results
    console.log('nearbyPlaces: ', nearbyPlaces)
    const waypoints = nearbyPlaces.slice(0, numWaypoints).map((place: any) => ({
      name: place.name,
      location: place.geometry.location,
    }))

    // Return the extracted waypoints
    return NextResponse.json({ waypoints }, { status: 200 })
  } catch (error) {
    console.error('Error fetching nearby scenic locations:', error)
    return NextResponse.json(
      { error: 'Error fetching nearby scenic locations' },
      { status: 500 },
    )
  }
}
