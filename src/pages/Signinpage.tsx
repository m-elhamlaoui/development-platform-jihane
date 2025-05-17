import background  from "../components/Assets/22.jpg";
import rocket from "../components/Assets/Logo.png"
import Signinform from "../components/Signin/signinform";
const Signin = () => {
  return (
    <div className="min-h-screen w-full bg-no-repeat bg-cover bg-center flex items-center justify-center" style={{ backgroundImage: `url(${background})` }}>
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between p-4 md:p-10 text-white gap-8 md:gap-20">
        <div className="flex flex-col items-center md:items-start w-full md:w-1/2 relative">
          <div className="flex items-center mb-6">
            <img className="h-10 w-10 object-cover mr-2" src={rocket} alt="Logo" />
            <h1 className="font-orbitron text-lg md:text-xl font-bold text-white italic tracking-wide">BELONG EARTH</h1>
          </div>
          <div className="mt-8 md:mt-20 text-center md:text-left">
            <h1 className="text-white font-bold italic text-3xl md:text-5xl">PREPARE FOR LAUNCH</h1>
            <h1 className="text-purple-500 font-bold italic text-2xl md:text-5xl mt-2">Sign in NOW!!</h1>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center items-center bg-opacity-50 rounded-lg shadow-lg">
          <Signinform />
        </div>
      </div>
    </div>
  )
}

export default Signin