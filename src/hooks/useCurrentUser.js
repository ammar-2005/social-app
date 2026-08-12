import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () =>
      axios.get('https://route-posts.routemisr.com/users/profile-data', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      }).then(res => res.data?.data?.user || res.data?.user),
    staleTime: Infinity, // بيانات المستخدم ما بتتغير كتير، ما في داعي نجيبها كل شوي
  })
}