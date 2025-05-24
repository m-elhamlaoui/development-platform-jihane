import background  from "../components/Assets/22.jpg";
import rocket from "../components/Assets/Logo.png"
import Signinform from "../components/Signin/signinform";
const Signin = () => {
return (
  <div
    className="min-h-screen w-full bg-no-repeat bg-cover bg-center relative flex items-center justify-center"
    style={{ backgroundImage: `url(${background})` }}
  >
    {/* Logo en haut à gauche */}
    <div className="absolute top-4 left-4 flex items-center">
      <img className="h-10 w-10 object-cover mr-2" src={rocket} alt="Logo" />
      <h1 className="font-orbitron text-lg md:text-xl font-bold text-white italic tracking-wide">
        BELONG EARTH
      </h1>
    </div>

    {/* Texte en bas à gauche mais pas trop bas */}
    <div className="absolute bottom-24 md:bottom-32 left-4 text-left">
      <h1 className="text-white font-bold italic text-3xl md:text-5xl">
        PREPARE FOR LAUNCH
      </h1>
      <h1 className="text-purple-500 font-bold italic text-2xl md:text-5xl mt-2">
        Sign in NOW!!
      </h1>
    </div>

    {/* Formulaire centré mais légèrement vers la droite */}
    <div className="w-full max-w-xl md:w-[30%] translate-x-6 md:translate-x-85">
      <div className="bg-opacity-60 p-8 rounded-xl shadow-xl w-full">
        <Signinform />
      </div>
    </div>
  </div>
);


}

export default Signin