'use client'
import React, { useState } from 'react'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import {
  constructGoogleMapsUrl,
  CurrentLocation,
  getRoute,
  Waypoint,
} from '../client-utils/getRoute'
import RouteIcon from '@mui/icons-material/Route'
import useGeolocation, { GeoLocationError } from '../hooks/useGeolocation'
import TextField from '@mui/material/TextField'
import DarkModeSwitch from './darkModeSwitch'
import DirectionsIcon from '@mui/icons-material/Directions'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import Divider from '@mui/material/Divider'

export const RoutePlanner = () => {
  const [initialized, setInitialized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [radius, setRadius] = useState(15)
  const [numWaypoints, setNumWaypoints] = useState(5)
  const [duration, setDuration] = useState(60)

  const { location, geoLocationError } = useGeolocation()

  const handlePlanRoute = async () => {
    setLoading(true)
    setInitialized(true)
    if (!location) return
    const result = await getRoute(
      location.latitude,
      location.longitude,
      radius,
      duration,
    )
    if (result) setWaypoints(result)

    setLoading(false)
  }

  const handleRemoveWaypoint = (index: number) => {
    setWaypoints((prevWaypoints) => prevWaypoints.filter((_, i) => i !== index))
  }

  return (
    <div className="center">
      <DarkModeSwitch />
      <Card className="card">
        <CardContent>
          <div className="form-container">
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
              id="waypoints"
              label="Number of waypoints"
              variant="outlined"
              type="number"
              value={Number(numWaypoints).toString()}
              onChange={(event) => setNumWaypoints(Number(event.target.value))}
              className="textfield"
              color="secondary"
            />
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePlanRoute}
            startIcon={<RouteIcon />}
            disabled={loading || !location}
          >
            Plan route
          </Button>
          {loading && (
            <div className="loading-spinner">
              <CircularProgress />
            </div>
          )}

          {geoLocationError &&
            geoLocationError === GeoLocationError.PERMISSION_DENIED && (
              <>
                <div className="spacer"></div>
                <Typography variant="h6">
                  Please allow geolocation permissions and refresh this page
                </Typography>

                <Typography variant="caption">
                  Your location data is never stored by RouteRoulette anywhere.
                  RouteRoulette respects your privacy.
                </Typography>
              </>
            )}

          {!loading && waypoints.length > 0 && (
            <>
              <div className="spacer"></div>
              <Divider />
              <div className="waypoint-container">
                <Typography variant="h6">Waypoints</Typography>
                {waypoints.slice(0, numWaypoints).map((waypoint, index) => (
                  <div key={index} className="waypoint-item-container">
                    <IconButton
                      onClick={() => handleRemoveWaypoint(index)}
                      color="error"
                    >
                      <CancelIcon />
                    </IconButton>
                    <Typography variant="body1">{waypoint.name}</Typography>
                  </div>
                ))}
              </div>
              <Button
                variant="contained"
                color="secondary"
                target="_blank"
                href={constructGoogleMapsUrl(
                  location as CurrentLocation,
                  waypoints.slice(0, numWaypoints),
                )}
                startIcon={<DirectionsIcon />}
              >
                Directions
              </Button>
            </>
          )}

          {waypoints.length === 0 && initialized && !loading && (
            <>
              <div className="spacer"></div>
              <Typography variant="h6">No waypoints found</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
