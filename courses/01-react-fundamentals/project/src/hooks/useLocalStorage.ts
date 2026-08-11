import { useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      if (stored !== null) {
        return JSON.parse(stored) as T
      }
    } catch {
      // Invalid or missing data - fall back to initialValue
    }
    return initialValue
  })

  const setStoredValue = (newValue: T | ((prev: T) => T)) => {
    setValue((prev) => {
      const resolved =
        typeof newValue === 'function'
          ? (newValue as (prev: T) => T)(prev)
          : newValue

      try {
        localStorage.setItem(key, JSON.stringify(resolved))
      } catch {
        // Storage unavailable or full - ignore
      }

      return resolved
    })
  }

  return [value, setStoredValue]
}