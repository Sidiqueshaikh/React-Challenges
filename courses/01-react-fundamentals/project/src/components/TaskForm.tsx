import { useState } from 'react'
import type { FormEvent } from 'react'
import FormInput from './FormInput'
import Button from './Button'

interface TaskFormProps {
  onAddTask?: (task: Record<string, unknown>) => void
  existingCategories?: string[]
}

const DEFAULT_CATEGORIES = ['General', 'Work', 'Personal']

export default function TaskForm({ onAddTask, existingCategories }: TaskFormProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('Low')
  const [category, setCategory] = useState('General')
  const [tagsInput, setTagsInput] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const categoryOptions = Array.from(
    new Set([...DEFAULT_CATEGORIES, ...(existingCategories ?? [])])
  )

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)

    const newTask = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim(),
      priority,
      completed: false,
      category,
      tags,
      dueDate: dueDate || undefined,
    }

    onAddTask?.(newTask)

    setTitle('')
    setDescription('')
    setPriority('Low')
    setCategory('General')
    setTagsInput('')
    setDueDate('')
    setError('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormInput
        label="Title"
        id="task-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        type="text"
      />

      <div>
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="task-category-select">Category</label>
        <select
          id="task-category-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categoryOptions.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <FormInput
        label="Tags (comma-separated)"
        id="task-tags-input"
        value={tagsInput}
        onChange={(e) => setTagsInput(e.target.value)}
        type="text"
      />

      <FormInput
        label="Due Date"
        id="task-due-date-input"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        type="date"
      />

      {error && <p id="task-form-error">{error}</p>}

      <Button type="submit">Add Task</Button>
    </form>
  )
}