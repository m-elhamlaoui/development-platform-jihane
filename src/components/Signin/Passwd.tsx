import React from 'react'
import{ Eye, EyeOff } from 'lucide-react'
function Passwd() {
    const [showPassword, setShowPassword] = React.useState(false);



    return (
        <div className='flex flex-row gap-35 w-100 h-13  m-0 text-white bg-[#14022D] p-3 rounded-2xl mb-4 '>
            <div className='flex flex-row gap-2'>
            <label className='pl-1'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
            </label>
            <input
            className='focus:outline-none  ' 
            type={showPassword ? "text":"password"}
            placeholder="Enter your password"
            />
            </div>
            <button
            className='ml-0 p-0'
            type="button"
            onClick={() => setShowPassword(prev => !prev)}
            >
{showPassword ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
          </button>
          
        </div>
    )
}
export default Passwd
