import React, { useState } from 'react'
import CommentCard from './CommentCard'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import CreateComment from '../Components/CreateComment/CreateComment'
import { useCurrentUser } from '../hooks/useCurrentUser'

export default function PostCard({ post, isSinglePost = false }) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const { data: currentUser } = useCurrentUser()

  if (!post) return null

  const isOwner = currentUser?._id === post.user._id

  function getPostComments() {
    return axios.get(`https://route-posts.routemisr.com/posts/${post._id}/comments`, {
      params: { limit: 10 },
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => res.data?.data?.comments || res.data?.comments || [])
  }

  const { data } = useQuery({
    queryKey: ['getPostComments', post._id],
    queryFn: getPostComments,
    enabled: isSinglePost && !!post._id,
  })

  function handleDeletePost() {
    setMenuOpen(false)
    if (!window.confirm('Are you sure you want to delete this post?')) return

    axios.delete(`https://route-posts.routemisr.com/posts/${post._id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
    .then(() => {
      queryClient.setQueryData(['posts'], (oldPosts) => {
        if (!oldPosts) return oldPosts
        const clonedPosts = structuredClone(oldPosts)
        return clonedPosts.filter((p) => p._id !== post._id)
      })
      if (isSinglePost) navigate('/home')
    })
    .catch((err) => console.log(err))
  }

  return (
    <div className="bg-white p-4 rounded-2xl shadow-2xl relative">

      {/* Owner menu */}
      {isOwner && (
        <div className="absolute top-3 right-3">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <i className="fa-solid fa-ellipsis" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                <Link
                  to={`/posts/edit/${post._id}`}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => setMenuOpen(false)}
                >
                  <i className="fa-solid fa-pen text-xs" />
                  Edit
                </Link>
                <button
                  onClick={handleDeletePost}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <i className="fa-solid fa-trash text-xs" />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <Link to={`/detailsPost/${post._id ?? post.id}`} className="block">
        <header className="flex items-center space-x-3 mb-3">
          <img src={post.user.photo} alt={post.user.name} className='h-10 w-10 rounded-full' />
          <div>
            <p className="font-semibold">{post.user.name}</p>
            <p className="text-xs text-gray-500">{post.createdAt}</p>
          </div>
        </header>
        {post.body && <p className="mb-3">{post.body}</p>}
        {post.image && (
          <img src={post.image} alt={post.body} className="rounded max-h-96 w-full object-cover mb-3" />
        )}
      </Link>

      <div className="flex justify-between text-gray-600 text-sm font-semibold mb-3">
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-thumbs-up" />
          <span>Like{post.likesCount > 0 ? ` (${post.likesCount})` : ''}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-comment" />
          <span>Comment{post.commentsCount > 0 ? ` (${post.commentsCount})` : ''}</span>
        </button>
        <button className="flex items-center space-x-1 hover:text-blue-600">
          <i className="fas fa-share" />
          <span>{post.sharesCount > 0 ? `${post.sharesCount} ` : ''}Share</span>
        </button>
      </div>

      <CreateComment postId={post._id} />

      {!isSinglePost && post.topComment && <CommentCard comment={post.topComment} postId={post._id} />}

      {isSinglePost && data?.map((comment) => (
        <CommentCard comment={comment} postId={post._id} key={comment._id} />
      ))}
    </div>
  )
}