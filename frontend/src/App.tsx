import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signin from "./pages/Signinpage";
import Signup from "./pages/Signuppage";
import Homepage from "./components/Homepage";
import Agencies from "./components/Agencies";
import Programs from "./components/Programs";
import Astronauts from "./components/Astronauts";
import Profilepage from "./pages/Profilepage";
import Landingpage from "./pages/Landingpage";
import Header from './components/Header';
import Details from './components/Details';
import LaunchDetails from './components/LaunchDetails';
import ProgramDetails from './components/ProgramDetails';
import AstronautDetails from './components/AstronautDetails';
import { ToastContainer } from 'react-toastify';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Homepage />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/agencies" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Agencies />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/programs" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Programs />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/astronauts" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Astronauts />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/astronaut/:id" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <AstronautDetails />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/details/:id" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Details />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/launch/:id" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <LaunchDetails />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/program/:id" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <ProgramDetails />
            </main>
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Header />
            <main className="main-content">
              <Profilepage />
            </main>
          </ProtectedRoute>
        } />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
