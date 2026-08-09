interface TaskCardProps {
  title: string
  description: string
  priority: string
  completed?: boolean
  onToggle?: (id: string | number) => void
  onDelete?: (id: string | number) => void
  taskId?: string | number
  id?: string | number
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
}: TaskCardProps) {
  const resolvedId = taskId ?? id

  const handleToggle = () => {
    onToggle?.(resolvedId as string | number)
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      onDelete?.(resolvedId as string | number)
    }
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
      {onDelete && (
        <button type="button" onClick={handleDelete}>
          Delete
        </button>
      )}
    </article>
  )
}