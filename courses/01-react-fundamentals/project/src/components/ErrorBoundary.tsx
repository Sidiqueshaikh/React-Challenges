import { Component, type ReactNode } from 'react'
import Button from './Button'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
  // eslint-disable-next-line no-console
  console.error('ErrorBoundary caught an error:', error)
}

  handleRetry = () => {
    this.setState({ hasError: false })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-fallback">
          <p>Something went wrong. Please try again.</p>
          <Button id="error-retry" onClick={this.handleRetry}>
            Retry
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}