import { useState } from 'react'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  taskId?: string | number
  id?: string | number
  isEditing?: boolean
  onEditStart?: (id: string | number) => void
  onEditCancel?: () => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void
}

export default function TaskCard({
  title,
  description,
  priority,
  completed = false,
  onToggle,
  onDelete,
  taskId,
  id,
  isEditing = false,
  onEditStart,
  onEditCancel,
  onUpdateTask,
}: TaskCardProps) {
  const resolvedId = taskId ?? id

  const [editTitle, setEditTitle] = useState(title)
  const [editDescription, setEditDescription] = useState(description)
  const [editPriority, setEditPriority] = useState(priority)
  const [error, setError] = useState('')

  const handleToggle = () => {
    onToggle?.(resolvedId as string | number)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      onDelete?.(resolvedId as string | number)
    }
  }

  const handleEditStart = () => {
    setEditTitle(title)
    setEditDescription(description)
    setEditPriority(priority)
    setError('')
    onEditStart?.(resolvedId as string | number)
  }

  const handleSave = () => {
    if (!editTitle.trim()) {
      setError('Title is required')
      return
    }
    onUpdateTask?.(resolvedId as string | number, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    })
  }

  const handleCancel = () => {
    setError('')
    onEditCancel?.()
  }

  if (isEditing) {
    return (
      <article id="task-card" data-completed={completed}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          aria-label="Edit title"
        />
        <textarea
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
          aria-label="Edit description"
        />
        <select
          value={editPriority}
          onChange={(e) => setEditPriority(e.target.value)}
          aria-label="Edit priority"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {error && <p id="task-form-error">{error}</p>}
        <button type="button" onClick={handleSave}>
          Save
        </button>
        <button type="button" onClick={handleCancel}>
          Cancel
        </button>
      </article>
    )
  }

  return (
    <article id="task-card" data-completed={completed}>
      {onToggle && (
        <input
          type="checkbox"
          checked={completed}
          onChange={handleToggle}
          aria-label={`Toggle ${title}`}
        />
      )}
      <h2 style={completed ? { textDecoration: 'line-through' } : undefined}>
        {title}
      </h2>
      <p style={completed ? { textDecoration: 'line-through' } : undefined}>
        {description}
      </p>
      <p>Priority: {priority}</p>
      {onUpdateTask && (
        <button type="button" onClick={handleEditStart}>
          Edit
        </button>
      )}
      {onDelete && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}