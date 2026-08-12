import { Outlet } from 'react-router-dom'
import React from 'react'
import Footer from '../Footer/Footer'
import Navbar from '../Navbar/Navbar'

export default function Layout() {
  return (
   <>
   <Navbar/>
 <Outlet />
 <Footer />
   </>
  )
}

