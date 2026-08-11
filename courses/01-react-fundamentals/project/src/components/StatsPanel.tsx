interface StatsPanelProps {
  total?: number
  completed?: number
  active?: number
  overdue?: number
  completedPercentage?: number
}

export default function StatsPanel({
  total = 0,
  completed = 0,
  active = 0,
  overdue = 0,
  completedPercentage = 0,
}: StatsPanelProps) {
  return (
    <div id="stats-panel">
      <p id="stats-total">Total: {total}</p>
      <p id="stats-completed">
        Completed: {completed} ({completedPercentage}%)
      </p>
      <p id="stats-active">Active: {active}</p>
      <p id="stats-overdue">Overdue: {overdue}</p>

      <div
        role="progressbar"
        aria-valuenow={completedPercentage}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${completedPercentage}%`,
            height: '100%',
            backgroundColor: '#22c55e',
          }}
        />
      </div>
    </div>
  )
}