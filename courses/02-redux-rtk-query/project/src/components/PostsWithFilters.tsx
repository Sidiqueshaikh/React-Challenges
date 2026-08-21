import { useGetPostsQuery } from '../api/apiSlice'
import { useAppSelector, useAppDispatch } from '../store/hooks'
import { setSortBy, setFilterUserId } from '../store/slices/filtersSlice'

export default function PostsWithFilters() {
  const { data, isLoading, error } = useGetPostsQuery()
  const { sortBy, filterUserId } = useAppSelector((state) => state.filters)
  const dispatch = useAppDispatch()

  const userIds = data ? Array.from(new Set(data.map((p) => p.userId))) : []

  const filteredPosts = data
    ? data.filter((p) => filterUserId === null || p.userId === filterUserId)
    : []

  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'newest') return b.id - a.id
    if (sortBy === 'oldest') return a.id - b.id
    if (sortBy === 'title') return a.title.localeCompare(b.title)
    return 0
  })

  if (isLoading) {
    return <p data-testid="posts-loading">Loading...</p>
  }

  if (error) {
    return <p data-testid="posts-error">Failed to load posts.</p>
  }

  return (
    <div data-testid="posts-with-filters">
      <div data-testid="filter-controls">
        <label htmlFor="sort-by">Sort by</label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as 'newest' | 'oldest' | 'title'))}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
        </select>

        <label htmlFor="filter-user">Filter by user</label>
        <select
          id="filter-user"
          value={filterUserId ?? ''}
          onChange={(e) =>
            dispatch(setFilterUserId(e.target.value ? Number(e.target.value) : null))
          }
        >
          <option value="">All users</option>
          {userIds.map((id) => (
            <option key={id} value={id}>
              User {id}
            </option>
          ))}
        </select>
      </div>

      <ul>
        {sortedPosts.map((post) => (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}