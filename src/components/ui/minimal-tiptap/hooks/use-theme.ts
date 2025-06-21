import * as React from "react"

export const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false)

  React.useEffect(() => {
+   // Guard against SSR environments
+   if (typeof window === 'undefined') return
+
+   // Check if matchMedia is supported
+   if (!window.matchMedia) {
+     console.warn('matchMedia not supported')
+     return
+   }
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    setIsDarkMode(darkModeMediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      const newDarkMode = e.matches
      setIsDarkMode(newDarkMode)
    }

    darkModeMediaQuery.addEventListener("change", handleChange)

    return () => {
      darkModeMediaQuery.removeEventListener("change", handleChange)
    }
  }, [])

  return isDarkMode
}

export default useTheme
