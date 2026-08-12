import React, { useState } from 'react'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function CommentCard({ comment, postId }) {
  const queryClient = useQueryClient()
  const { data: currentUser } = useCurrentUser()

  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  if (!comment) return null

  const isOwner = currentUser?._id === comment?.commentCreator?._id

  function refreshComments() {
    queryClient.invalidateQueries(['getPostComments', postId])
  }

  function handleUpdateComment() {
    if (!editText.trim()) return
    setIsSaving(true)
    setError(null)

    const formData = new FormData()
    formData.append('content', editText)

    axios.put(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => {
      setIsEditing(false)
      refreshComments()
    })
    .catch((err) => {
      console.log(err)
      setError(err?.response?.data?.message || 'Could not update comment')
    })
    .finally(() => setIsSaving(false))
  }

  function handleDeleteComment() {
    if (!window.confirm('Delete this comment?')) return

    axios.delete(`https://route-posts.routemisr.com/posts/${postId}/comments/${comment._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => refreshComments())
    .catch((err) => console.log(err))
  }

  return (
    <div className="w-full bg-white p-4 rounded-2xl shadow container mx-auto border border-gray-200 mt-4">
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <img
            src={comment?.commentCreator?.photo}
            alt={comment?.commentCreator?.name}
            className='h-10 w-10 rounded-full'
          />
          <div>
            <p className="font-semibold">{comment?.commentCreator?.name}</p>
            <p className="text-xs text-gray-500">{comment?.createdAt}</p>
          </div>
        </div>

        {isOwner && !isEditing && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => { setIsEditing(true); setEditText(comment.content) }}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-sky-600 transition-colors"
            >
              <i className="fa-solid fa-pen text-xs" />
            </button>
            <button
              onClick={handleDeleteComment}
              className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <i className="fa-solid fa-trash text-xs" />
            </button>
          </div>
        )}
      </header>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 mb-2"
          />
          <div className="flex gap-2">
            <button
              onClick={handleUpdateComment}
              disabled={isSaving}
              className="text-xs font-semibold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white px-4 py-1.5 rounded-full transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="text-xs font-semibold text-gray-500 hover:text-gray-700 px-4 py-1.5"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      ) : (
        <p className="mb-1">{comment?.content}</p>
      )}
    </div>
  )
}