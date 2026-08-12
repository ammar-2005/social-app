import { useState } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'  
import './App.css'
import Layout from './Layout/Layout'
import Home from './Components/Home'
import Navbar from './Navbar/Navbar'
import Footer from './Footer/Footer'
import Profile from './Profile/Profile'        
import Login from './Auth/Login'              
import Register from './Auth/Register'
import Notfound from './Notfound/Notfound'   
import { AuthContextProvider } from './Context/AuthContext'
import ProtectRoute from './ProtectRotute/ProtectRoute'
import ProtectAuth from './ProtectRotute/ProtectAuth'
import CreatePost from './Components/CreatePost'
import PostDetails from './Components/PostDetails'
import EditPost from './Components/EditPost'
import ChangePassword from './Auth/ChangePassword'

function App() {
  const router = createBrowserRouter([
   {
  path: '/',
  element: <Layout />,
  children: [
    { index: true, element: <ProtectAuth><Login /></ProtectAuth> },  
    { path: 'home', element: <ProtectRoute><Home /></ProtectRoute> },
    { path: 'profile', element:<ProtectRoute><Profile /></ProtectRoute> },
    { path: 'nav', element: <Navbar /> },
    { path: 'footer', element: <Footer /> },
    { path: 'login', element: <ProtectAuth><Login /></ProtectAuth> },
    { path: 'register', element:  <ProtectAuth><Register /></ProtectAuth>},
  { path: 'change-password', element: <ProtectRoute><ChangePassword /></ProtectRoute> },
    { path: 'createPost', element: <ProtectRoute><CreatePost /></ProtectRoute> },
    { path: 'detailsPost/:id', element: <ProtectRoute><PostDetails /></ProtectRoute> },
  { path: 'posts/edit/:id', element: <ProtectRoute><EditPost /></ProtectRoute> },
    { path: '*', element: <Notfound />},
  ]
  
}
  ],
   {
    basename: '/social-app/'
  }
)

  return <AuthContextProvider>
  <RouterProvider router={router} />
  </AuthContextProvider>
}

export default App