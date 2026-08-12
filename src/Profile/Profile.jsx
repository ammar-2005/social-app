import React from 'react'
import  { useEffect, useState } from 'react'
import axios from 'axios'
import Home from '../Components/Home'
import PostCard  from '../Components/PostCard'
import { Link } from 'react-router-dom'

export default function Profile() {
   const [user, setUser] = useState(null)
  const [posts, setPosts] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  function getProfileAndPosts(){
    axios.get('https://route-posts.routemisr.com/users/profile-data',{
       headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then((response) =>{ 
      console.log('profile-data response:', response.data)
      const userData = response.data?.data?.user
      setUser(userData)
       const userId = userData?._id
      if (userId) {
        return axios.get(`https://route-posts.routemisr.com/users/${userId}/posts`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
      }
    })
      .then((postsResponse) => {
      if (postsResponse) {
        console.log('user posts response:', postsResponse.data)
        const postsData = postsResponse.data?.data?.posts || postsResponse.data?.posts || postsResponse.data
        setPosts(postsData)
      }
    })
      .catch((error) => {
      console.log(error)
      setIsError(true)
    })
       .finally(() => {
      setIsLoading(false)
    })
  }
    useEffect(() => {
    getProfileAndPosts()
  }, [])
  return (
  <div className="max-w-2xl mx-auto px-3 py-6">
          {/* Profile header */}
      {user && (
        <div className="bg-white rounded-2xl shadow p-6 mb-6 text-center">
          <img
            src={user.photo}
            alt={user.name}
            className="w-24 h-24 rounded-full mx-auto mb-3 object-cover border-4 border-white shadow"
          />
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500 text-sm">@{user.username}</p>
          {user.email && (
            <p className="text-gray-400 text-xs mt-1">{user.email}</p>
          )}
           <Link
      to="/change-password"
      className="inline-flex items-center gap-2 text-sky-600 text-sm font-semibold hover:underline mt-4"
    >
      <i className="fa-solid fa-lock" />
      Change Password
    </Link>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <p className="text-center text-gray-500 py-10">جاري التحميل...</p>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-center text-red-500 py-10">حدث خطأ أثناء تحميل البيانات</p>
      )}
          {/* Empty state */}
      {!isLoading && !isError && posts?.length === 0 && (
        <p className="text-center text-gray-400 py-10">لا يوجد منشورات بعد</p>
      )}      
       {/* Posts list */}
      <div className="flex flex-col gap-4">
        {posts?.map((post) => (
          <PostCard post={post} key={post._id} />
        ))}
      </div>



  </div>
  )
}