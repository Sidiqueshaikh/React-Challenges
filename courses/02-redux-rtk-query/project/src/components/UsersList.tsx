import { useGetUsersQuery } from '../api/apiSlice'

export default function UsersList() {
  const { data, isLoading, error } = useGetUsersQuery()

  if (isLoading) {
    return <p data-testid="users-loading">Loading...</p>
  }

  if (error) {
    return <p data-testid="users-error">Failed to load users.</p>
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