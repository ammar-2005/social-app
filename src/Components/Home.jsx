import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import PostCard from './PostCard'
import Spinner from './Spinner/Spinner'
import { Link } from 'react-router-dom'

function getPosts() {
  return axios.get('https://route-posts.routemisr.com/posts', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }).then(response => response.data.data.posts)
}
export default function Home() {
  const { data: allPosts, isLoading, isError } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts

  })

  return (
    <div className="max-w-2xl mx-auto px-3 py-6 flex flex-col gap-4">
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {isError && (
        <p className="text-center text-red-500">حدث خطأ أثناء تحميل المنشورات</p>
      )}

      {allPosts?.map((post) => (
        <PostCard post={post} key={post._id}  isSinglePost={false}/>
      ))}

      <Link
        to="/createPost"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center shadow-lg transition-colors z-10"
        aria-label="Create new post"
      >
        <i className="fa-solid fa-plus text-xl" />
      </Link>
    </div>
  )
}