import React from 'react'
import { BeatLoader } from 'react-spinners';

export default function Spinner() {
  return (
    <div className="flex justify-center items-center h-screen">
        <BeatLoader  color="#0284c7" />
    </div>
  )
}
