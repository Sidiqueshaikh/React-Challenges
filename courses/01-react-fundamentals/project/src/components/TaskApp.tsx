import { useState, useEffect, useMemo, useReducer, useCallback } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import FilterBar from './FilterBar'
import StatsPanel from './StatsPanel'
import ThemeToggle from './ThemeToggle'
import ErrorBoundary from './ErrorBoundary'
import { ThemeProvider } from '../contexts/ThemeContext'
import { taskReducer, ADD_TASK, TOGGLE_TASK, DELETE_TASK, UPDATE_TASK } from '../reducers/taskReducer'
import type { Task } from './TaskList'

type FilterValue = 'all' | 'active' | 'completed'
type SortValue = 'recent' | 'priority-high' | 'priority-low' | 'alphabetical' | 'due-date'

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
  { id: 1, title: 'First Task', description: 'Description for first task', priority: 'High', completed: false, category: 'General', tags: [] },
  { id: 2, title: 'Second Task', description: 'Description for second task', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 3, title: 'Third Task', description: 'Description for third task', priority: 'Low', completed: false, category: 'General', tags: [] },
  { id: 4, title: 'Fourth Task', description: 'Description for fourth task', priority: 'Medium', completed: false, category: 'General', tags: [] },
  { id: 5, title: 'Fifth Task', description: 'Description for fifth task', priority: 'High', completed: false, category: 'General', tags: [] },
]

const PRIORITY_RANK: Record<string, number> = { High: 3, Medium: 2, Low: 1 }
const STORAGE_KEY = 'task-app-tasks'
const DEBOUNCE_DELAY = 300

function withDefaults(task: Task): Task {
  return {
    ...task,
    category: task.category ?? 'General',
    tags: task.tags ?? [],
  }
}

function loadPersistedTasks(): Task[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return (parsed as Task[]).map(withDefaults)
      }
    }
  } catch {
    // Invalid or missing data - fall back to defaults
  }
  return defaultTasks
}

export default function TaskApp({
  tasks,
  setTasks,
  dispatch,
  showForm,
  countFormat,
  showFilterBar,
  showStatsPanel,
  linkToTaskDetail,
}: TaskAppProps) {
  const [internalTasks, internalDispatch] = useReducer(taskReducer, undefined, loadPersistedTasks)
  const [filter, setFilter] = useState<FilterValue>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortOrder, setSortOrder] = useState<SortValue>('recent')
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [searchText, setSearchText] = useState('')
  const [debouncedSearchText, setDebouncedSearchText] = useState('')

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText)
    }, DEBOUNCE_DELAY)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [searchText])

  const isSearching = searchText !== debouncedSearchText

  const list = (tasks ?? internalTasks).map(withDefaults)

  useEffect(() => {
    if (tasks) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(internalTasks))
    } catch {
      // Storage unavailable or full - ignore
    }
  }, [internalTasks, tasks])

  const categories = Array.from(
    new Set(list.map((t) => t.category).filter((c): c is string => Boolean(c)))
  )

  const stats = useMemo(() => {
    const total = list.length
    const completed = list.filter((t) => t.completed).length
    const active = total - completed
    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0

    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const overdue = list.filter((t) => {
      if (t.completed || !t.dueDate) return false
      const due = new Date(t.dueDate)
      due.setHours(0, 0, 0, 0)
      return due.getTime() < now.getTime()
    }).length

    return { total, completed, active, overdue, completedPercentage }
  }, [list])

  const sortedList = useMemo(() => {
    const statusFilteredList =
      filter === 'active'
        ? list.filter((t) => !t.completed)
        : filter === 'completed'
        ? list.filter((t) => t.completed)
        : list

    const categoryFilteredList =
      categoryFilter === 'all'
        ? statusFilteredList
        : statusFilteredList.filter((t) => t.category === categoryFilter)

    const searchedList = debouncedSearchText.trim()
      ? categoryFilteredList.filter((t) => {
          const query = debouncedSearchText.trim().toLowerCase()
          return (
            t.title.toLowerCase().includes(query) ||
            t.description.toLowerCase().includes(query)
          )
        })
      : categoryFilteredList

    return [...searchedList].sort((a, b) => {
      if (sortOrder === 'priority-high') {
        return (PRIORITY_RANK[b.priority] ?? 0) - (PRIORITY_RANK[a.priority] ?? 0)
      }
      if (sortOrder === 'priority-low') {
        return (PRIORITY_RANK[a.priority] ?? 0) - (PRIORITY_RANK[b.priority] ?? 0)
      }
      if (sortOrder === 'alphabetical') {
        return a.title.toLowerCase().localeCompare(b.title.toLowerCase())
      }
      if (sortOrder === 'due-date') {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      }
      return 0
    })
  }, [list, filter, categoryFilter, debouncedSearchText, sortOrder])

  const completedCount = list.filter((t) => t.completed).length
  const countText =
    showFilterBar
      ? `Showing ${sortedList.length} of ${list.length} tasks`
      : countFormat === 'completed'
      ? `${completedCount} of ${list.length} completed`
      : countFormat === 'tasks'
      ? `${list.length} Tasks`
      : `${list.length}`

  const emptyMessage = debouncedSearchText.trim()
    ? `No tasks found for "${debouncedSearchText.trim()}"`
    : 'No tasks match this filter'

  const handleAddTask = useCallback(
    (taskData: Record<string, unknown>) => {
      const task = withDefaults(taskData as unknown as Task)

      if (dispatch) {
        dispatch({ type: ADD_TASK, payload: task })
      } else if (setTasks) {
        setTasks((prev) => [...prev, task])
      } else {
        internalDispatch({ type: ADD_TASK, payload: task })
      }
    },
    [dispatch, setTasks]
  )

  const handleToggle = useCallback(
    (id: string | number) => {
      if (dispatch) {
        dispatch({ type: TOGGLE_TASK, payload: id })
      } else if (setTasks) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
        )
      } else {
        internalDispatch({ type: TOGGLE_TASK, payload: id })
      }
    },
    [dispatch, setTasks]
  )

  const handleDelete = useCallback(
    (id: string | number) => {
      if (dispatch) {
        dispatch({ type: DELETE_TASK, payload: id })
      } else if (setTasks) {
        setTasks((prev) => prev.filter((t) => t.id !== id))
      } else {
        internalDispatch({ type: DELETE_TASK, payload: id })
      }
    },
    [dispatch, setTasks]
  )

  const handleUpdateTask = useCallback(
    (
      id: string | number,
      updates: { title: string; description: string; priority: string }
    ) => {
      if (dispatch) {
        dispatch({ type: UPDATE_TASK, payload: { id, ...updates } })
      } else if (setTasks) {
        setTasks((prev) =>
          prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
        )
      } else {
        internalDispatch({ type: UPDATE_TASK, payload: { id, ...updates } })
      }
      setEditingId(null)
    },
    [dispatch, setTasks]
  )

  const handleEditStart = useCallback((id: string | number) => {
    setEditingId(id)
  }, [])

  const handleEditCancel = useCallback(() => {
    setEditingId(null)
  }, [])

  return (
    <ThemeProvider>
      <div>
        <ThemeToggle />
        {showForm && <TaskForm onAddTask={handleAddTask} existingCategories={categories} />}
        {showFilterBar && (
          <FilterBar
            filter={filter}
            onFilterChange={setFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            searchText={searchText}
            onSearchChange={setSearchText}
            isSearching={isSearching}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            categories={categories}
          />
        )}
        {showStatsPanel && (
          <StatsPanel
            total={stats.total}
            completed={stats.completed}
            active={stats.active}
            overdue={stats.overdue}
            completedPercentage={stats.completedPercentage}
          />
        )}
        {showFilterBar && sortedList.length === 0 && (
          <p id="filter-empty-message">{emptyMessage}</p>
        )}
        <ErrorBoundary>
          <TaskList
            tasks={sortedList}
            countText={countText}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdateTask={handleUpdateTask}
            editingId={editingId}
            onEditStart={handleEditStart}
            onEditCancel={handleEditCancel}
            linkToTaskDetail={linkToTaskDetail}
          />
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  )
}