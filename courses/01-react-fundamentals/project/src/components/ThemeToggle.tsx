import { useTheme } from '../contexts/ThemeContext'
import Button from './Button'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <Button id="theme-toggle" variant="secondary" onClick={toggleTheme}>
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </Button>
  )
}