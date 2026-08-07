import { useState } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import type { Task } from './TaskList'

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

export default function TaskApp({ tasks, setTasks, dispatch, showForm, countFormat }: TaskAppProps) {
  const [internalTasks, setInternalTasks] = useState<Task[]>(defaultTasks)

  const list = tasks ?? internalTasks
  const countText = countFormat === 'tasks' ? `${list.length} Tasks` : `${list.length}`

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

  return (
    <div>
      <p id="task-count">{countText}</p>
      {showForm && <TaskForm onAddTask={handleAddTask} />}
      <TaskList tasks={list} countText={countText} />
    </div>
  )
}