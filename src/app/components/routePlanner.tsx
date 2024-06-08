'use client'
import React, { useState } from 'react'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import {
  constructGoogleMapsUrl,
  getRoute,
  Waypoint,
} from '../client-utils/getRoute'
import RouteIcon from '@mui/icons-material/Route'
import useGeolocation from '../hooks/useGeolocation'
import TextField from '@mui/material/TextField'
import DarkModeSwitch from './darkModeSwitch'
import DirectionsIcon from '@mui/icons-material/Directions'
import CircularProgress from '@mui/material/CircularProgress'

export const RoutePlanner = () => {
  // const [keywords, setKeywords] = useState('')
  const [loading, setLoading] = useState(false)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [radius, setRadius] = useState(15)
  const [numPitStops, setNumPitStops] = useState(2)
  const [duration, setDuration] = useState(60)

  const { location, geoLocationError } = useGeolocation()
  const handlePlanRoute = async () => {
    setLoading(true)
    // Implement route planning logic here
    if (!location) return
    const result = await getRoute(
      location.latitude,
      location.longitude,
      radius,
      numPitStops,
      duration,
    )
    if (result) setWaypoints(result)

    const googleMapsUrl = constructGoogleMapsUrl(result)
    setLoading(false)
  }
  return (
    <div className="center">
      <Card className="card">
        <CardContent>
          <DarkModeSwitch />
          <div className="form-container">
            {/* <TextField
              id="keywords"
              label="Search (optional) i.e. 'coffee, park'"
              variant="outlined"
              value={keywords}
              onChange={(event) => setKeywords(event.target.value)}
              className="textfield"
              color="secondary"
            /> */}
            <TextField
              id="radius"
              label="Maximum distance (miles)"
              variant="outlined"
              type="number"
              value={Number(radius).toString()}
              onChange={(event) => setRadius(Number(event.target.value))}
              className="textfield"
              color="secondary"
            />
            <TextField
              id="duration"
              label="Drive duration (minutes)"
              variant="outlined"
              type="number"
              value={Number(duration).toString()}
              onChange={(event) => setDuration(Number(event.target.value))}
              className="textfield"
              color="secondary"
            />
            <TextField
              id="pitstops"
              label="Number of pitstops"
              variant="outlined"
              type="number"
              value={Number(numPitStops).toString()}
              onChange={(event) => setNumPitStops(Number(event.target.value))}
              className="textfield"
              color="secondary"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlanRoute}
            startIcon={<RouteIcon />}
          >
            Plan route
          </Button>

          {loading && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}

          {!loading && waypoints.length > 0 && (
            <div className="waypoint-container">
              <Typography variant="h6">Waypoints</Typography>
              <ul>
                {waypoints.map((waypoint, index) => (
                  <li key={index}>{waypoint.name}</li>
                ))}
              </ul>

              <Button
                variant="contained"
                color="secondary"
                target="_blank"
                href={constructGoogleMapsUrl(waypoints)}
                startIcon={<DirectionsIcon />}
              >
                Directions
              </Button>
            </div>
          )}

          {waypoints.length === 0 && !loading && (
            <Typography variant="h6">No waypoints found</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
