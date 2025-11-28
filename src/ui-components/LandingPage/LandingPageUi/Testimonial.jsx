import React from 'react'
import { FaBrain, FaBookOpen, FaUserAlt, FaPencilAlt } from "react-icons/fa";

export default function Testimonial() {
  return (
    <div className="flex flex-wrap justify-center gap-1.5 sm:gap-3">
    <div className="flex items-center bg-background border border-border px-3 py-2 rounded-full">
      <FaPencilAlt size={17} className="text-yellow-500 mr-1.5 sm:mr-3" />
      <span className="text-text text-xs sm:text-sm">
        Help me write
      </span>
    </div>
    <div className="flex items-center bg-background border border-border px-3 py-2 rounded-full">
      <FaBrain size={17} className="text-gray-500 mr-1.5 sm:mr-3" />
      <span className="text-text text-xs sm:text-sm">
        Brainstorm
      </span>
    </div>
    <div className="flex items-center bg-background border border-border px-3 py-2 rounded-full">
      <FaBookOpen size={17} className="text-green-500 mr-1.5 sm:mr-3" />
      <span className="text-text text-xs sm:text-sm">
        Summarize text
      </span>
    </div>
    <div className="flex items-center bg-background border border-border px-3 py-2 rounded-full">
      <FaUserAlt size={17} className="text-purple-500 mr-1.5 sm:mr-3" />
      <span className="text-text text-xs sm:text-sm">
        Get advice
      </span>
    </div>
    <div className="flex items-center bg-background border border-border px-3 py-2 rounded-full">
      <span className="text-text text-xs sm:text-sm">More</span>
    </div>
  </div>
  )
}
