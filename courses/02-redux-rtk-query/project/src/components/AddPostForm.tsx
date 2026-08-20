import { useState } from 'react'
import type { FormEvent } from 'react'
import { useAddPostMutation } from '../api/apiSlice'

export default function AddPostForm() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [addPost, { isLoading, isSuccess }] = useAddPostMutation()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !body.trim()) return

    await addPost({ userId: 1, title: title.trim(), body: body.trim() })

    setTitle('')
    setBody('')
  }

  return (
    <form data-testid="add-post-form" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="post-title">Title</label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="post-body">Body</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <button type="submit" data-testid="add-post-submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Add Post'}
      </button>

      {isSuccess && <p>Post added successfully!</p>}
    </form>
  )
}