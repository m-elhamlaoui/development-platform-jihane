

const Signinform = () => {
  return (
    <div className="absolute mt-30 ml-0 " >
      <form  className=" bg-opacity-50 p-8 rounded-lg shadow-lg w-96 pt-0 w-full h-full ">
          <h1 className="text-7xl text-white font-bold  mb-10 ">SIGN IN</h1>
          <p className="text-sm text-white font-bold mb-4 ">Sign in with your email address.</p>
        <div className="w-full ">
          
          <input type="email" 
          placeholder="Yourname@gmail.com"
          className="w-100 h-13 text-white bg-[#14022D] p-3 rounded-2xl mb-5"
          />
          <br/>
         <input type="password" 
          placeholder="Enter your Password"
          className="w-100 h-13  text-white bg-[#14022D] p-3 rounded-2xl mb-4"
          />
          <br/>
          <button
          type="submit" 
          className="w-100 p-3 h-13 text-white text-[20px] font-bold rounded-2xl bg-gradient-to-r from-[#492871] to-[#113B65] ">
            Sign in
          </button>
          <p className="text-sm text-white  mt-4 text-center ">
            Don't have an account? 
            <a href="/signup" className="text-[#113B65] font-bold  "> Sign up</a>
          </p>
          <hr className="mb-2 mt-2"style={{ color: '#727272' }} />
          <p className="text-sm text-[B6B6B6] ">
            Or continue with
          </p>
          <button 
          className="w-100 p-3  bg-[#14022D] text-white font-bold rounded-2xl  mt-4 text-center">Google</button>
        </div>
      </form>
      
      
    </div>
  )
}

export default Signinform
