import { useParams, useNavigate } from 'react-router-dom'
import type { Task } from './TaskList'

const STORAGE_KEY = 'task-app-tasks'

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed as Task[]
      }
    }
  } catch {
    // Invalid or missing data
  }
  return []
}

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const tasks = loadTasks()
  const task = tasks.find((t) => String(t.id) === id)

  const handleBack = () => {
    navigate('/challenge/21-react-router')
  }

  if (!task) {
    return (
      <div id="task-detail-page">
        <p>Task not found.</p>
        <button id="task-detail-back" type="button" onClick={handleBack}>
          Back to list
        </button>
      </div>
    )
  }

  return (
    <div id="task-detail-page">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Priority: {task.priority}</p>
      {task.category && <p>Category: {task.category}</p>}
      {task.tags && task.tags.length > 0 && (
        <p>Tags: {task.tags.join(', ')}</p>
      )}
      {task.dueDate && (
        <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
      )}
      <p>Status: {task.completed ? 'Completed' : 'Active'}</p>
      <button id="task-detail-back" type="button" onClick={handleBack}>
        Back to list
      </button>
    </div>
  )
}