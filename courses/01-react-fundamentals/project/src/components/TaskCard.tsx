import { useState } from 'react'
import React from 'react'
import Button from './Button'
import Badge from './Badge'
import StatusIndicator from './StatusIndicator'

interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  category?: string
  tags?: string[]
  dueDate?: string
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  taskId?: string | number
  id?: string | number
  isEditing?: boolean
  onEditStart?: (id: string | number) => void
  onEditCancel?: () => void
  onUpdateTask?: (id: string | number, updates: { title: string; description: string; priority: string }) => void
}

function getDueDateStatus(dueDate: string | undefined, completed: boolean) {
  if (!dueDate || completed) return null

  const due = new Date(dueDate)
  due.setHours(0, 0, 0, 0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return { status: 'overdue', overdue: true }
  if (diffDays === 0) return { status: 'due-today', overdue: false }
  if (diffDays <= 3) return { status: 'due-soon', overdue: false }
  return null
}

function TaskCard({
  title,
  description,
  priority,
  completed = false,
  category,
  tags,
  dueDate,
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

  const dueStatus = getDueDateStatus(dueDate, completed)

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
        <Button onClick={handleSave}>Save</Button>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </article>
    )
  }

  return (
    <article id="task-card" data-completed={completed} data-overdue={dueStatus?.overdue ?? false}>
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
      <p>
        Priority: <Badge variant="priority">{priority}</Badge>
      </p>
      {category && (
        <p id="task-category">
          Category: <Badge variant="category">{category}</Badge>
        </p>
      )}
      {tags && tags.length > 0 && (
        <div id="task-tags">
          {tags.map((tag) => (
            <Badge key={tag} variant="tag">
              {tag}
            </Badge>
          ))}
        </div>
      )}
      {dueDate && (
        <p id="task-due-date">
          Due: {new Date(dueDate).toLocaleDateString()}
          {dueStatus && (
            <>
              {' '}
              <StatusIndicator status={dueStatus.status} />
            </>
          )}
        </p>
      )}
      {onUpdateTask && <Button onClick={handleEditStart}>Edit</Button>}
      {onDelete && (
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </article>
  )
}

export default React.memo(TaskCard)