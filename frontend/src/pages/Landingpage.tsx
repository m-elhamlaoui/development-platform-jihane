import React from 'react';
import { useNavigate } from 'react-router-dom';
import background from "../components/Assets/22.jpg";
import rocket from "../components/Assets/Logo.png";

const Landingpage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-full">
      {/* Fixed Background */}
      <div 
        className="fixed top-0 left-0 w-screen h-screen bg-no-repeat bg-cover bg-center bg-fixed"
        style={{ 
          backgroundImage: `url(${background})`,
          zIndex: -1
        }}
      />

      {/* Scrollable Content */}
      <div className="relative">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <img className="h-8 w-8 object-cover mr-2" src={rocket} alt="Logo" />
                <h1 className="font-orbitron text-lg font-bold text-white italic tracking-wide">BELONG EARTH</h1>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate('/signin')}
                  className="px-4 py-2 text-white hover:text-purple-400 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="px-4 py-2 bg-gradient-to-r from-[#492871] to-[#113B65] text-white rounded-lg hover:opacity-90 transition-all"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Explore the Final Frontier
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Your gateway to the latest space missions, astronaut profiles, and space agency programs.
              Stay connected with humanity's journey to the stars.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-[#492871] to-[#113B65] text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all transform hover:scale-105"
              >
                Get Started
              </button>
              <button
                onClick={() => {
                  const token = localStorage.getItem('token');
                  if (token) {
                    navigate('/home');
                  } else {
                    navigate('/signin');
                  }
                }}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                Explore Now
              </button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                <div className="text-gray-300">Active Astronauts</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Space Agencies</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
                <div className="text-gray-300">Launch Updates</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-purple-400 mb-2">50+</div>
                <div className="text-gray-300">Space Programs</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Discover Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Launch News */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all">
                <div className="text-purple-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Launch News</h3>
                <p className="text-gray-300 mb-4">
                  Stay updated with the latest rocket launches, mission updates, and space exploration milestones from around the world.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Real-time launch updates
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mission status tracking
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Detailed mission information
                  </li>
                </ul>
              </div>

              {/* Astronaut Profiles */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all">
                <div className="text-purple-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Astronaut Profiles</h3>
                <p className="text-gray-300 mb-4">
                  Explore detailed profiles of astronauts, their missions, achievements, and contributions to space exploration.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Comprehensive biographies
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mission history
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Current assignments
                  </li>
                </ul>
              </div>

              {/* Space Programs */}
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:transform hover:scale-105 transition-all">
                <div className="text-purple-400 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Space Programs</h3>
                <p className="text-gray-300 mb-4">
                  Discover ongoing and upcoming space programs from major space agencies and private companies.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Program timelines
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Agency collaborations
                  </li>
                  <li className="flex items-center">
                    <svg className="h-5 w-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mission objectives
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

   
        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Explore Space?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join our community of space enthusiasts and stay connected with the latest developments in space exploration.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() => navigate('/signup')}
                className="px-8 py-4 bg-gradient-to-r from-[#492871] to-[#113B65] text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all"
              >
                Create Account
              </button>
              <button
                onClick={() => navigate('/signin')}
                className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white text-lg font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-lg py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center mb-4">
                  <img className="h-8 w-8 object-cover mr-2" src={rocket} alt="Logo" />
                  <h1 className="font-orbitron text-lg font-bold text-white italic tracking-wide">BELONG EARTH</h1>
                </div>
                <p className="text-gray-300">Your gateway to space exploration and discovery.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li><button onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      navigate('/home');
                    } else {
                      navigate('/signin');
                    }
                  }} className="text-gray-300 hover:text-purple-400 transition-colors">Home</button></li>
                  <li><button onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      navigate('/astronauts');
                    } else {
                      navigate('/signin');
                    }
                  }} className="text-gray-300 hover:text-purple-400 transition-colors">Astronauts</button></li>
                  <li><button onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      navigate('/programs');
                    } else {
                      navigate('/signin');
                    }
                  }} className="text-gray-300 hover:text-purple-400 transition-colors">Programs</button></li>
                  <li><button onClick={() => {
                    const token = localStorage.getItem('token');
                    if (token) {
                      navigate('/agencies');
                    } else {
                      navigate('/signin');
                    }
                  }} className="text-gray-300 hover:text-purple-400 transition-colors">Agencies</button></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Contact</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">Terms of Service</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-gray-300 hover:text-purple-400 transition-colors">
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300">
              <p>© 2024 Belong Earth. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landingpage; 