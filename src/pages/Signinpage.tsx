import background  from "../components/Assets/22.jpg";
import rocket from "../components/Assets/Logo.png"
import Signinform from "../components/Signin/signinform";
const Signin = () => {
  
  return (
    <>
    <div className=" bg-no-repeat  w-screen h-screen bg-cover bg-center "
      style={{
        backgroundImage: `url(${background})`
      }}
    >
      <div className="w-1/2 flex flex-col justify-between p-10  text-white grid grid-cols-2 gap-345">
        <div className="flex items-center mb-6">
          <div className="absolute top-0 left-0 m-4 flex flex-row items-start">
            <img
                className="h-8 w-8 object-cover mr-2  "
                src={rocket}
                alt="Logo"
              />
            <h1 className="font-orbitron text-l font-bold mt-2 text-white italic tracking-wide ">
              BELONG EARTH
            </h1>
          </div>
          <div className="absolute top-3/4 left-6 text-xL flex flex-col items-start  ">
            <h1 className="text-white font-bold italic text-5xl ">PREPARE FOR LAUNCH</h1>
            <h1 className="text-purple-500 font-bold italic text-5xl ">
              Sign in NOW!!
            </h1>
          </div>    
        </div>
        <div className=" w-100 mt-5 flex justify-center items-center  bg-opacity-50 pt-80 w-full h-full rounded-lg shadow-lg pr-100">
          <Signinform />
        </div>
      </div>
    </div>
    
  
    
    </>
  )
}

export default Signin