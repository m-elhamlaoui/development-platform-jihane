import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import rocket from "../components/Assets/Logo.png";
import background from "../components/Assets/22.jpg";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    // ✅ Regex validations
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!emailRegex.test(email)) {
      toast.error("Email must be a valid @gmail.com address.");
      return;
    }

    if (!passwordRegex.test(password)) {
      toast.error("Password must be at least 8 characters long and include at least one letter, one number, and one special character.");
      return;
    }

    if (password !== password2) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      toast.success("Registration successful! Please sign in.");
      navigate('/signin');
    } catch (error: any) {
      console.error("Registration failed:", error);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignin = () => {
    navigate('/signin');
  };

  return (
  <div className="bg-gradient-to-r from-[#0F0320] to-[#0C0417] min-h-screen w-full">
    {/* Header Logo */}
    <div className="absolute top-0 left-0 m-4 flex items-center">
      <img className="h-8 w-8 object-cover mr-2" src={rocket} alt="Logo" />
      <h1 className="font-orbitron text-lg font-bold text-white italic tracking-wide">
        BELONG EARTH
      </h1>
    </div>

    {/* Centered Form */}
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="bg-transparent border border-[#434141] rounded-xl p-6 sm:p-8 w-full max-w-md"
        onSubmit={handleRegister}
      >
        <h1 className="text-4xl sm:text-5xl text-white font-bold text-center mb-8">
          SIGN UP
        </h1>

        {/* Email Field */}
        <div className="h-14 mb-6 rounded-2xl bg-[#14022D] flex items-center gap-2 text-[#DDD4D4] px-4">
          <label>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575">
              <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z" />
            </svg>
          </label>
          <input
            type="email"
            placeholder="Yourname@gmail.com"
            className="focus:outline-none w-full bg-transparent"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Password Field */}
        <div className="h-14 mb-6 rounded-2xl bg-[#14022D] flex items-center justify-between px-4 text-white">
          <div className="flex items-center gap-2 w-full">
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
              </svg>
            </label>
            <input
              className="focus:outline-none w-full bg-transparent"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className="h-14 mb-6 rounded-2xl bg-[#14022D] flex items-center justify-between px-4 text-white">
          <div className="flex items-center gap-2 w-full">
            <label>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575">
                <path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z" />
              </svg>
            </label>
            <input
              className="focus:outline-none w-full bg-transparent"
              type={showPassword2 ? "text" : "password"}
              placeholder="Confirm your password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />
          </div>
          <button type="button" onClick={() => setShowPassword2((prev) => !prev)}>
            {showPassword2 ? (
              <Eye className="w-5 h-5 text-gray-500" />
            ) : (
              <EyeOff className="w-5 h-5 text-gray-500" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 text-white text-lg font-bold rounded-2xl bg-gradient-to-r from-[#492871] to-[#113B65] hover:opacity-90 transition-all"
        >
          Sign up
        </button>

        {/* Redirect to Sign In */}
        <p className="text-sm text-white mt-6 text-center">
          Already have an account?{" "}
          <a href="/signin" className="text-[#113B65] font-bold">
            Sign in
          </a>
        </p>
      </form>
    </div>
  </div>
);

};

export default Signup;
