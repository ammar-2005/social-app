import React from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import PostCard from './PostCard'

export default function PostDetails() {
  const { id } = useParams()

  const getPostDetails = async () => {
    const response = await axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    console.log('RAW post details response:', response.data)
    return response.data?.data?.post || response.data?.data || response.data
  }

  const { data: post, isLoading, isError: isPostError } = useQuery({
    queryKey: ['postDetails', id],
    queryFn: getPostDetails,
    enabled: !!id,
    retry: false,
  })

  if (isPostError) {
    return <p className="text-red-500 text-center py-10">Something went wrong while loading this post</p>
  }

  if (isLoading) {
    return <p className="text-center text-gray-500 py-10">Loading post details...</p>
  }

  return (
    <div className='max-w-2xl mx-auto px-3 py-6'>
      <Link
        to="/home"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm mb-4 transition-colors"
      >
        <i className="fa-solid fa-arrow-left" />
        Back
      </Link>
      <PostCard post={post} isSinglePost={true} />
    </div>
  )
}