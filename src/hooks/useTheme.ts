import { createContext, useContext, useEffect, useState } from 'react'
import { ThemeContextType } from '@/types'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
	const context = useContext(ThemeContext)
	if (context === undefined) {
		throw new Error('useTheme must be used within a ThemeProvider')
	}
	return context
}

export const useThemeState = () => {
	const [isDark, setIsDark] = useState(false)

	useEffect(() => {
		// Check for saved theme preference or default to system preference
		const savedTheme = localStorage.getItem('theme')
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
		
		const shouldBeDark = savedTheme === 'dark' || (savedTheme === null && prefersDark)
		setIsDark(shouldBeDark)
		
		// Apply theme to document
		if (shouldBeDark) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	}, [])

	const toggleTheme = () => {
		const newTheme = !isDark
		setIsDark(newTheme)
		
		if (newTheme) {
			document.documentElement.classList.add('dark')
			localStorage.setItem('theme', 'dark')
		} else {
			document.documentElement.classList.remove('dark')
			localStorage.setItem('theme', 'light')
		}
	}

	return { isDark, toggleTheme }
}

