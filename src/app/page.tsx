'use client'
import React from 'react'

import { RoutePlanner } from './components/routePlanner'
import { Typography } from '@mui/material'
import Footer from './components/footer'

export default function Home() {
  return (
    <main className="center">
      <div className="title-container">
        <Typography
          variant="h2"
          component="h1"
          sx={(theme) => ({
            [theme.breakpoints.down('sm')]: { ...theme.typography.h3 },
          })}
        >
          Route Roulette
        </Typography>
      </div>
      <RoutePlanner />

      <div className="spacer"></div>
      <Footer />
    </main>
  )
}
