import React from 'react'
import{ Eye, EyeOff } from 'lucide-react'
type PasswdProps = {
  password: string;
  setPassword: (value: string) => void;
};

const Passwd = ({ password, setPassword }: PasswdProps) => {
    const [showPassword, setShowPassword] = React.useState(false);


    return (
  <div className="w-full px-4 py-3 bg-[#14022D]/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus-within:ring-2 focus-within:ring-[#492871] transition-all">
    <div className="flex items-center gap-2">
      {/* Lock Icon */}
      <label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#7a7575"
        >
          <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
        </svg>
      </label>

      {/* Password Input */}
      <input
        className="flex-grow bg-transparent focus:outline-none text-white placeholder-gray-400"
        type={showPassword ? "text" : "password"}
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Toggle Button */}
      <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
        {showPassword ? (
          <Eye className="w-5 h-5 text-gray-500" />
        ) : (
          <EyeOff className="w-5 h-5 text-gray-500" />
        )}
      </button>
    </div>
  </div>
);

}
export default Passwd
