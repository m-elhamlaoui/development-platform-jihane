import React from 'react'
import { useNavigate } from 'react-router-dom';
import{ Eye, EyeOff } from 'lucide-react'
import { auth,db } from '../components/firebase'; // Import Firebase auth
import { useState } from 'react';
import { toast } from 'react-toastify';
import{setDoc, doc} from 'firebase/firestore'

import rocket from "../components/Assets/Logo.png";
import { createUserWithEmailAndPassword } from 'firebase/auth';

const Signup = () =>  {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [password2, setPassword2] = React.useState("");

    const [showPassword, setShowPassword] = React.useState(false);
    const [showPassword2, setShowPassword2] = React.useState(false);
    interface RegisterEvent extends React.FormEvent<HTMLFormElement> {}
    const handleRegister = async (e: RegisterEvent): Promise<void> => {
        e.preventDefault();
    
        // ✅ Regex validations
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
    
        if (!emailRegex.test(email)) {
            console.log('Email must be a valid @gmail.com address.');
            
            return;
        }
    
        if (!passwordRegex.test(password)) {
            console.log(
                'Password must be at least 8 characters long and include at least one letter, one number, and one special character.'
            );
            toast.error("Password must be at least 8 characters long and include at least one letter, one number, and one special character.");
            return;
        }
    
        if (password !== password2) {
            console.log('Passwords do not match.');
            toast.error("Passwords do not match.");
           
            return;
        }
    
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            if(user){
                await setDoc(doc(db, "Users", user.uid),{
                    email:user.email,
                    password:password,
                    password2:password2,
                });
            }
                console.log("User registered successfully!");
                toast.success("User registered successfully!");
            }catch (error) {
            if (error instanceof Error) {
                console.log('Registration error:', error.message);
                toast.error(error.message,{
                    position: "bottom-center",
                    
                });

            } else {
                console.log('An unknown error occurred.');
            }
        }
    };
    


    return (
        <div className="bg-gradient-to-r from-[#0F0320] to-[#0C0417] min-h-screen w-full">
            <div className="absolute top-0 left-0 m-4  flex flex-row items-start">
                <img
                    className="h-8 w-8 object-cover mr-2  "
                    src={rocket}
                    alt="Logo"
                />
                <h1 className="font-orbitron text-l font-bold mt-2 text-white italic tracking-wide ">
                    BELONG EARTH
                </h1>
            </div>
            <div className="absolute mt-50 ml-180 w-110 h-150 " >
                <form className=" p-8 border border-[#434141]   w-96 pt-0 w-full h-full justify-center w-full h-full" onSubmit={handleRegister}>
                    <h1 className="text-7xl text-white font-bold mt-5 ml-10  ">SIGN up</h1>            
                    <div className="w-full ">

                        <div className="  h-13 bg-[#14022D] h-15 mt-16 rounded-2xl focus:outline-none  flex flex-row gap-2 text-[#DDD4D4]  ">
                            <label className="pt-4 pl-4"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575"><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm320-280 320-200v-80L480-520 160-720v80l320 200Z"/></svg></label>
                            <input type="email" 
                                placeholder="Yourname@gmail.com"
                                className=" focus:outline-none w-80 "
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                
                            />
                        </div>
                        <div className='flex flex-row gap-28 w-100 h-15 mt-8  w-full  text-white bg-[#14022D] p-3 rounded-2xl  '>
                            <div className='flex flex-row gap-2'>
                                <label className=' pt-1 pl-1'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                                <input
                                    className='focus:outline-none  ' 
                                    type={showPassword ? "text":"password"}
                                    placeholder="Enter your password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
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
                        <div className='flex flex-row gap-28 w-100 h-15 mt-8  w-full  text-white bg-[#14022D] p-3 rounded-2xl  '>
                            <div className='flex flex-row gap-2'>
                                <label className=' pt-1 pl-1'><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#7a7575"><path d="M240-80q-33 0-56.5-23.5T160-160v-400q0-33 23.5-56.5T240-640h40v-80q0-83 58.5-141.5T480-920q83 0 141.5 58.5T680-720v80h40q33 0 56.5 23.5T800-560v400q0 33-23.5 56.5T720-80H240Zm240-200q33 0 56.5-23.5T560-360q0-33-23.5-56.5T480-440q-33 0-56.5 23.5T400-360q0 33 23.5 56.5T480-280ZM360-640h240v-80q0-50-35-85t-85-35q-50 0-85 35t-35 85v80Z"/></svg>
                                </label>
                                <input
                                    className='focus:outline-none  ' 
                                    type={showPassword2 ? "text":"password"}
                                    placeholder="Confirm your password"
                                    value={password2}
                                    onChange={(e) => setPassword2(e.target.value)}
                                    required
                                />
                             </div>
                                <button
                                    className='ml-0 p-0'
                                    type="button"
                                    onClick={() => setShowPassword2(prev => !prev)}
                                >
                                    {showPassword2 ? <Eye className="w-5 h-5 text-gray-500" /> : <EyeOff className="w-5 h-5 text-gray-500" />}
                                </button>
                        
                        </div>
                        <br/>

                        <br/>
                        <button
                            type="submit" 
                            className="w-100 p-3 h-13 w-full h-15 text-white text-[20px] font-bold rounded-2xl bg-gradient-to-r from-[#492871] to-[#113B65] ">
                            Sign up
                        </button>
                        <p className="text-sm text-white  mt-15 text-center ">
                        Already have an account ? 
                            <a href="/signup" className="text-[#113B65] font-bold  "> Sign in</a>
                        </p>
                        
                        
                        
                    </div>
                </form>
            </div>
        </div>
    
  )
}

export default Signup