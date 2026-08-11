interface StatusIndicatorProps {
  status?: string
  label?: string
}

const DEFAULT_LABELS: Record<string, string> = {
  overdue: 'Overdue',
  'due-today': 'Due Today',
  'due-soon': 'Due Soon',
  completed: 'Completed',
}

export default function StatusIndicator({ status, label }: StatusIndicatorProps) {
  if (!status) return null

  return <span data-status={status}>{label ?? DEFAULT_LABELS[status] ?? status}</span>
}