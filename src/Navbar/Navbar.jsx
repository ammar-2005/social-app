import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Navbar() {
  let naivigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
let {userToken , setUserToken } = useContext(AuthContext) 
 function logOut(){
  localStorage.removeItem('token') 
 setUserToken(null)
  naivigate('/')

 }

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sky-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`

  return (
    <>
    <nav className="bg-white/80 backdrop-blur-md fixed w-full z-20 top-0 inset-x-0 border-b border-gray-200 py-3">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto px-4">

        <NavLink to='/home' className="flex items-center gap-2.5 group">
       
          <span className="self-center text-xl text-gray-900 font-bold whitespace-nowrap tracking-tight">
            Social<span className="text-sky-600">App</span>
          </span>
        </NavLink>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-600 rounded-full md:hidden hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
          aria-controls="navbar-default"
          aria-expanded={isOpen}
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <i className="fa-solid fa-xmark text-lg" />
          ) : (
            <i className="fa-solid fa-bars text-lg" />
          )}
        </button>

        <div
          className={`${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 md:opacity-100'} overflow-hidden transition-all duration-300 ease-in-out w-full md:max-h-none md:overflow-visible md:w-auto`}
          id="navbar-default"
        >
          <ul className="font-medium flex flex-col gap-1 p-4 md:p-0 mt-3 border border-gray-200 rounded-2xl bg-gray-50 md:flex-row md:gap-2 md:mt-0 md:border-0 md:bg-transparent">

            {userToken !== null ? (
              <>
                <li>
                  <NavLink to='/home' className={linkClass}>
                    <i className="fa-solid fa-house text-xs" />
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/profile' className={linkClass}>
                    <i className="fa-solid fa-user text-xs" />
                    Profile
                  </NavLink>
                </li>
              </>
            ) : ''}

            {userToken == null ? (
              <>
                <li>
                  <NavLink to='/login' className={linkClass}>
                    <i className="fa-solid fa-right-to-bracket text-xs" />
                    Login
                  </NavLink>
                </li>
                <li>
                  <NavLink to='/register' className={({ isActive }) =>
                    `flex items-center gap-2 py-2 px-4 rounded-full text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-sky-700 text-white'
                        : 'bg-sky-600 text-white hover:bg-sky-700'
                    }`
                  }>
                    <i className="fa-solid fa-user-plus text-xs" />
                    Register
                  </NavLink>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={logOut}
                  className="w-full flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  Logout
                  <i className="fa-solid fa-arrow-right-from-bracket text-xs" />
                </button>
              </li>
            )}

          </ul>
        </div>
      </div>
    </nav>
    <div className="h-[68px]" />
    </>
  )
}