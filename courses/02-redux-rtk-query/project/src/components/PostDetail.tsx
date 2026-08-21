import { useParams } from 'react-router-dom'
import { useGetPostByIdQuery } from '../api/apiSlice'

export default function PostDetail() {
  const { postId } = useParams<{ postId?: string }>()
  const id = postId ? Number(postId) : 1

  const { data, isLoading, error } = useGetPostByIdQuery(id, { skip: !id })

  if (isLoading) {
    return <p data-testid="post-detail-loading">Loading post...</p>
  }

  if (error) {
    return <p data-testid="post-detail-error">Failed to load post.</p>
  }

  return (
    <div data-testid="post-detail">
      <h2>{data?.title}</h2>
      <p>{data?.body}</p>
    </div>
  )
}