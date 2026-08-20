import { useGetPostsQuery } from '../api/apiSlice'

export default function PostsList() {
  const { data, isLoading, error } = useGetPostsQuery()

  if (isLoading) {
    return <p data-testid="posts-loading">Loading...</p>
  }

  if (error) {
    return <p data-testid="posts-error">Failed to load posts.</p>
  }

  return (
    <ul data-testid="posts-list">
      {data?.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}