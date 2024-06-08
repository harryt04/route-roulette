'use client'
import React, { createContext, useContext, useEffect, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { lightTheme, darkTheme } from '../theme'

const ThemeContext = createContext({
  theme: lightTheme,
  toggleDarkMode: () => {},
})

const ThemeProvider = ({ children }: any) => {
  const [theme, setTheme] = useState(lightTheme)

  useEffect(() => {
    // Check if a theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme')
    if (storedTheme) {
      setTheme(storedTheme === 'dark' ? darkTheme : lightTheme)
    } else {
      // If no theme is stored, use the user's system preference
      const userPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches
      setTheme(userPrefersDark ? darkTheme : lightTheme)
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: any) => {
      const newTheme = e.matches ? darkTheme : lightTheme
      setTheme(newTheme)
      localStorage.setItem('theme', e.matches ? 'dark' : 'light')
    }
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  const toggleDarkMode = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === lightTheme ? darkTheme : lightTheme
      localStorage.setItem('theme', newTheme === darkTheme ? 'dark' : 'light')
      return newTheme
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeProvider

export const useThemeContext = () => useContext(ThemeContext)
