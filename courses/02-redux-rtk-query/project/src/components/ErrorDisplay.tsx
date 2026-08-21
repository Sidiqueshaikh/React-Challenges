interface ErrorDisplayProps {
  error?: unknown
  onRetry?: () => void
}

export default function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  const message =
    error && typeof error === 'object' && 'message' in error
      ? String((error as { message: unknown }).message)
      : 'Something went wrong. Please try again.'

  return (
    <div data-testid="error-display">
      <p>{message}</p>
      {onRetry && (
        <button type="button" data-testid="retry-btn" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}