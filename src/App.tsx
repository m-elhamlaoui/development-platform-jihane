import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signinpage'
import Header from './components/Header';
import Homepage from './components/Homepage';
import Agencies from './components/Agencies';
import Programs from './components/Programs';
import Details from './components/Details';
import LaunchDetails from './components/LaunchDetails';
import ProgramDetails from './components/ProgramDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signin" replace />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/homepage" element={
          <>
            <Header />
            <main className="main-content">
              <Homepage />
            </main>
          </>
        } />
        <Route path="/agencies" element={
          <>
            <Header />
            <main className="main-content">
              <Agencies />
            </main>
          </>
        } />
        <Route path="/programs" element={
          <>
            <Header />
            <main className="main-content">
              <Programs />
            </main>
          </>
        } />
        <Route path="/details/:id" element={
          <>
            <Header />
            <main className="main-content">
              <Details />
            </main>
          </>
        } />
        <Route path="/launch/:id" element={
          <>
            <Header />
            <main className="main-content">
              <LaunchDetails />
            </main>
          </>
        } />
        <Route path="/program/:id" element={
          <>
            <Header />
            <main className="main-content">
              <ProgramDetails />
            </main>
          </>
        } />
      </Routes>
    </Router>
  )
}

export default App
