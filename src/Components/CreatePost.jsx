import React from 'react'
import  { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

export default function CreatePost() {
  const navigate = useNavigate()
  const [body, setBody] = useState('')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState(null)

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

  function handleSubmit(e) {
    e.preventDefault()

    if (!body.trim() && !image) {
      setApiError('اكتب شي أو ضيف صورة قبل النشر')
      return
    }

    setIsLoading(true)
    setApiError(null)

    const formData = new FormData()
    formData.append('body', body)
    if (image) {
      formData.append('image', image)
    }

    axios.post('https://route-posts.routemisr.com/posts', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then((response) => {
        console.log(response.data)
        navigate('/home')
      })
      .catch((error) => {
        console.log(error)
        setApiError(error?.response?.data?.message || 'حدث خطأ أثناء نشر المنشور')
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <div className='max-w-2xl mx-auto px-3 py-6'>
        
          {/* Header */}
      <div className="flex items-center gap-3 mb-5 justify-between">
       
        <h1 className="text-xl font-bold text-gray-900"> Now Add Post </h1> <Link
          to="/home"
          className="w-9 h-9 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
        >
          <i className="fa-solid fa-arrow-right" />
        </Link>
      </div>
       <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow p-5">

        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What are you thinking about?"
          rows={4}
          className="w-full resize-none border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500"
        />

        {/* Image preview */}
        {imagePreview && (
          <div className="relative mt-3">
            <img
              src={imagePreview}
              alt="Preview"
              className="rounded-xl max-h-80 w-full object-cover"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <i className="fa-solid fa-xmark text-sm" />
            </button>
          </div>
        )}

        {/* Bottom bar: image upload + submit */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <label className="flex items-center gap-2 text-gray-600 text-sm font-medium cursor-pointer hover:text-sky-600 transition-colors">
            <i className="fa-solid fa-image text-lg" />
            Image
              <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-sky-600 hover:bg-sky-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-2 rounded-full transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-spinner fa-spin" />
               Publishing...
              </span>
            ) : 'Post'}
          </button>
        </div>

        {apiError && (
          <div className="bg-red-50 border border-red-200 text-red-600 font-medium text-center rounded-xl py-2 px-3 mt-4 flex items-center justify-center gap-2">
            <i className="fa-solid fa-circle-exclamation" />
            {apiError}
          </div>
        )}

      </form>
    </div>
  )
}
