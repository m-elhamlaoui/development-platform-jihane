import React from 'react';
import { useNavigate } from 'react-router-dom';
import Passwd from "./Passwd"

import { toast } from 'react-toastify';




const Signinform = () => {
  const[email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  
  const navigate = useNavigate();

 

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    try{
      const response = await fetch('http://localhost:8080/api/login', {  
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        // If response status not 2xx, throw error to be caught below
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      // Save token (e.g., localStorage or context)
      localStorage.setItem('token', data.token);

      toast.success("User logged in successfully");

      // Redirect to homepage or protected route
      navigate('/homepage');
    } catch (error: any) {
      console.error("Error logging in:", error.message);
      toast.error(`Login failed: ${error.message}`);
    }
  };
  const goToSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="absolute mt-30 ml-0 " >
      <form onSubmit={handleSubmit} className=" bg-opacity-50 p-8 rounded-lg shadow-lg w-96 pt-0 w-full h-full ">
          <h1 className="text-7xl text-white font-bold  mb-10 ">SIGN IN</h1>
          <p className="text-sm text-white font-bold mb-4 ">Sign in with your email address.</p>
        
        <div className="w-full ">

          <div className="  h-13 bg-[#14022D]  rounded-2xl focus:outline-none  flex flex-row gap-2  ">
          <label className="pt-4 pl-4"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg></label>
          <input type="email" 
          placeholder="Yourname@gmail.com"
          className=" focus:outline-none w-80 "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          />
          </div>
          <br/>
        
          
          <Passwd password={password} setPassword={setPassword} />
          
          
          <br/>
          <button
          type="submit" 
          className="w-100 p-3 h-13 text-white text-[20px] font-bold rounded-2xl bg-gradient-to-r from-[#492871] to-[#113B65] ">
            Sign in
          </button>
          <p className="text-sm text-white  mt-4 text-center ">
            Don't have an account? 
            <button
              type="button"
              onClick={goToSignup}
              className="text-[#113B65] pl-2 font-bold  "> Sign up</button>
          </p>
          <hr className="mb-2 mt-2"style={{ color: '#727272' }} />
          <p className="text-sm text-[B6B6B6] ">
            Or continue with
          </p>
          <div className="flex flex-row gap-2 mt-4 pl-40 w-100 p-3  bg-[#14022D] text-white font-bold rounded-2xl  ">
            <label><svg width="20" height="20" viewBox="0 0 294 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M150 122.729V180.82H230.727C227.183 199.502 216.545 215.321 200.59 225.957L249.272 263.731C277.636 237.55 294 199.094 294 153.412C294 142.776 293.046 132.548 291.273 122.73L150 122.729Z" fill="#4285F4"/>
<path d="M65.9342 178.553L54.9546 186.958L16.0898 217.23C40.7719 266.185 91.3596 300.004 149.996 300.004C190.496 300.004 224.45 286.64 249.269 263.731L200.587 225.958C187.223 234.958 170.177 240.413 149.996 240.413C110.996 240.413 77.8602 214.095 65.9955 178.639L65.9342 178.553Z" fill="#34A853"/>
<path d="M16.0899 82.7734C5.86309 102.955 0 125.728 0 150.001C0 174.273 5.86309 197.047 16.0899 217.228C16.0899 217.363 66.0004 178.5 66.0004 178.5C63.0004 169.5 61.2272 159.955 61.2272 149.999C61.2272 140.043 63.0004 130.498 66.0004 121.498L16.0899 82.7734Z" fill="#FBBC05"/>
<path d="M149.999 59.7279C172.091 59.7279 191.727 67.3642 207.409 82.0918L250.364 39.1373C224.318 14.8647 190.5 0 149.999 0C91.3627 0 40.7719 33.6821 16.0898 82.7738L65.9988 121.502C77.8619 86.0462 110.999 59.7279 149.999 59.7279Z" fill="#EA4335"/>
</svg>
</label>
          <button 
          className="">
            Google
            </button>
            </div>
        </div>
      </form>
    </div>
  )
}

export default Signinform
