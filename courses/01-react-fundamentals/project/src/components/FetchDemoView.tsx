import { useState, useEffect } from 'react'

interface TodoItem {
  id: number
  title: string
}

export default function FetchDemoView() {
  const [items, setItems] = useState<TodoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    setLoading(true)
    setError(null)

    fetch('/api/todos.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`)
        }
        return res.json()
      })
      .then((data: TodoItem[]) => {
        if (!cancelled) {
          setItems(data)
          setLoading(false)
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message || 'Something went wrong')
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <p id="fetch-loading">Loading...</p>
  }

  if (error) {
    return <p id="fetch-error">{error}</p>
  }

  return (
    <ul id="fetch-list">
      {items.map((item) => (
        <li key={item.id}>{item.title}</li>
      ))}
    </ul>
  )
}