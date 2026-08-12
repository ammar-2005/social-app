import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useQueryClient } from '@tanstack/react-query'

export default function CreateComment({ postId }) {
  const queryClient = useQueryClient()

  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      content: '',
    }
  })

  const contentValue = watch('content')

  const [isSending, setIsSending] = useState(false)
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [error, setError] = useState(null)

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
  }

  function handleCreateComment(data) {
    setIsSending(true)
    setError(null)
      console.log('postId value:', postId)  

    const formData = new FormData()
    formData.append('content', data.content)
    if (image) {
      formData.append('image', image)
    }

    axios.post(`https://route-posts.routemisr.com/posts/${postId}/comments`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((response) => {
      console.log('RAW new comment response:', response.data)
      reset()
      removeImage()
      queryClient.invalidateQueries(['getPostComments', postId])
    })
    .catch((err) => {
      console.log(err)
      setError(err?.response?.data?.message || 'Something went wrong, please try again')
    })
    .finally(() => {
      setIsSending(false)
    })
  }

  return (
    <div className='p-4 mt-5'>
      <form className="bg-white rounded-2xl shadow p-4" onSubmit={handleSubmit(handleCreateComment)}>

        {imagePreview && (
          <div className="relative mb-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl max-h-60 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <i className="fa-solid fa-xmark text-xs" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-2">

          <label
            htmlFor={`imgFile-${postId}`}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-sky-600 cursor-pointer transition-colors"
          >
            <i className="fa-solid fa-image text-lg" />
            <input
              type="file"
              id={`imgFile-${postId}`}
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <input
            type="text"
            {...register('content')}
            className="flex-1 h-10 px-4 text-sm text-gray-700 border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
            placeholder="Add your comment"
          />

          <button
            type="submit"
            disabled={isSending || !contentValue?.trim()}
            className="flex-shrink-0 h-10 px-5 text-sm font-semibold bg-sky-600 hover:bg-sky-700 disabled:opacity-50 text-white rounded-full shadow-sm transition-colors flex items-center gap-2"
          >
            {isSending ? (
              <i className="fa-solid fa-spinner fa-spin" />
            ) : (
              <>
                Send
                <i className="fa-regular fa-paper-plane text-xs" />
              </>
            )}
          </button>

        </div>

        {error && (
          <p className="text-red-500 text-xs mt-2">{error}</p>
        )}
      </form>
    </div>
  )
}