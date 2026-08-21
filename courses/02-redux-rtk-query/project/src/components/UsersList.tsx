import { useGetUsersQuery } from '../api/apiSlice'
import ErrorDisplay from './ErrorDisplay'

export default function UsersList() {
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery()

  if (isLoading) {
    return <p data-testid="users-loading">Loading users...</p>
  }

  if (isError) {
    return <ErrorDisplay error={error} onRetry={refetch} />
  }

  return (
    <ul data-testid="users-list">
      {data?.map((user) => (
        <li key={user.id}>
          <p>{user.name}</p>
          <p>{user.email}</p>
          <p>{user.username}</p>
        </li>
      ))}
    </ul>
  )
}