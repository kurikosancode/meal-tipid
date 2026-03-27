import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)
    if (savedDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }

  return {
    darkMode,
    handleToggleDarkMode
  }
}
