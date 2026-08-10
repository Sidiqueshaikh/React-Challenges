import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import type { Task } from './TaskList'

type FilterValue = 'all' | 'active' | 'completed'
type SortValue = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical'

interface TaskAppProps {
  tasks?: Task[]
  setTasks?: Dispatch<SetStateAction<Task[]>>
  dispatch?: (action: { type: string; payload?: unknown }) => void
  showForm?: boolean
  countFormat?: string
  showFilterBar?: boolean
  showStatsPanel?: boolean
  onDelete?: (id: string | number) => void
  linkToTaskDetail?: boolean
}

const defaultTasks: Task[] = [
  { id: 1, title: 'First Task', description: 'Description for first task', priority: 'High', completed: false },
  { id: 2, title: 'Second Task', description: 'Description for second task', priority: 'Medium', completed: false },
  { id: 3, title: 'Third Task', description: 'Description for third task', priority: 'Low', completed: false },
  { id: 4, title: 'Fourth Task', description: 'Description for fourth task', priority: 'Medium', completed: false },
  { id: 5, title: 'Fifth Task', description: 'Description for fifth task', priority: 'High', completed: false },
]

const PRIORITY_RANK: Record<string, number> = { High: 3, Medium: 2, Low: 1 }

export default function TaskApp({
  tasks,
  setTasks,
  dispatch,
  showForm,
  countFormat,
  showFilterBar,
}: TaskAppProps) {
  const [internalTasks, setInternalTasks] = useState<Task[]>(defaultTasks)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [sortOrder, setSortOrder] = useState<SortValue>('recent')
  const [editingId, setEditingId] = useState<string | number | null>(null)

  const list = tasks ?? internalTasks

  const filteredList =
    filter === 'active'
      ? list.filter((t) => !t.completed)
      : filter === 'completed'
      ? list.filter((t) => t.completed)
      : list

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortOrder === 'priority-high') {
      return (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0)
    }
    if (sortOrder === 'priority-low') {
      return (PRIORITY_RANK[a.priority] ?? 0) - (PRIORITY_RANK[b.priority] ?? 0)
    }
    if (sortOrder === 'alphabetical') {
      return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
    }
    return 0
  })

  const completedCount = list.filter((t) => t.completed).length
  const countText =
    showFilterBar
      ? `Showing ${sortedList.length} of ${list.length} tasks`
      : countFormat === 'completed'
      ? `${completedCount} of ${list.length} completed`
      : countFormat === 'tasks'
      ? `${list.length} Tasks`
      : `${list.length}`

  const handleAddTask = (taskData: Record<string, unknown>) => {
    const task = taskData as unknown as Task

    if (dispatch) {
      dispatch({ type: 'ADD_TASK', payload: task })
    } else if (setTasks) {
      setTasks((prev) => [...prev, task])
    } else {
      setInternalTasks((prev) => [...prev, task])
    }
  }

  const handleToggle = (id: string | number) => {
    if (dispatch) {
      dispatch({ type: 'TOGGLE_TASK', payload: id })
    } else if (setTasks) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    } else {
      setInternalTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
      )
    }
  }

  const handleDelete = (id: string | number) => {
    if (dispatch) {
      dispatch({ type: 'DELETE_TASK', payload: id })
    } else if (setTasks) {
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } else {
      setInternalTasks((prev) => prev.filter((t) => t.id !== id))
    }
  }

  const handleUpdateTask = (
    id: string | number,
    updates: { title: string; description: string; priority: string }
  ) => {
    if (dispatch) {
      dispatch({ type: 'UPDATE_TASK', payload: { id, ...updates } })
    } else if (setTasks) {
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    } else {
      setInternalTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      )
    }
    setEditingId(null)
  }

  const handleEditStart = (id: string | number) => {
    setEditingId(id)
  }

  const handleEditCancel = () => {
    setEditingId(null)
  }

  return (
    <div>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      {showFilterBar && (
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      )}
      {showFilterBar && sortedList.length === 0 && (
        <p id="filter-empty-message">No tasks match this filter</p>
      )}
      <TaskList
        tasks={sortedList}
        countText={countText}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onUpdateTask={handleUpdateTask}
        editingId={editingId}
        onEditStart={handleEditStart}
        onEditCancel={handleEditCancel}
      />
    </div>
  )
}