import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-10">
      <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col items-center gap-4">

        {/* Logo mark */}
        <Link to="/home" className="flex items-center gap-2 group">
          
          <span className="text-base text-gray-900 font-bold tracking-tight">
            Social<span className="text-sky-600">App</span>
          </span>
        </Link>

        {/* Quick links */}
        <div className="flex items-center gap-5 text-sm text-gray-500">
          <Link to="/home" className="hover:text-sky-600 transition-colors">Home</Link>
          <Link to="/profile" className="hover:text-sky-600 transition-colors">Profile</Link>
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} SocialApp. All rights reserved.
        </p>

      </div>
    </footer>
  )
}