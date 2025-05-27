import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './components/Home';
import Room from './components/Room';
import Features from './components/Features';
import About from './components/About';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Navbar from './components/Navbar';

function App() {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      setIsLoggedIn(true);
      setCurrentUser(userData);
      setUserName(userData.name);
    }
  }, []);

  
  useEffect(() => {
    if (isLoggedIn && currentUser) {
      localStorage.setItem('userData', JSON.stringify(currentUser));
      localStorage.setItem('userName', currentUser.name);
    } else {
      localStorage.removeItem('userData');
      localStorage.removeItem('userName');
    }
  }, [isLoggedIn, currentUser]);

  
  const [isRoomPage, setIsRoomPage] = useState(false);
  
  
  useEffect(() => {
    const handleLocationChange = () => {
      setIsRoomPage(window.location.pathname.includes('/room/'));
    };
    
    
    handleLocationChange();
    
    
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);
  
  return (
    <div className="app w-screen max-w-[100vw] overflow-x-hidden">
      
      {!isRoomPage && (
        <Navbar 
          isLoggedIn={isLoggedIn} 
          setIsLoggedIn={setIsLoggedIn} 
          currentUser={currentUser} 
          setCurrentUser={setCurrentUser} 
        />
      )}
      <div className={`${!isRoomPage ? "pt-16" : ""} w-screen max-w-[100vw] overflow-x-hidden`}>
        <Routes>
          <Route 
            path="/" 
            element={
              <Home 
                userName={userName} 
                setUserName={setUserName} 
                isLoggedIn={isLoggedIn}
              />
            } 
          />
          <Route 
            path="/room/:roomId" 
            element={
              isLoggedIn ? (
                <Room 
                  userName={currentUser?.name || userName}
                  onRoomEnter={() => setIsRoomPage(true)}
                  onRoomExit={() => setIsRoomPage(false)}
                />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="/features" element={<Features />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/profile" 
            element={
              isLoggedIn ? (
                <Profile />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/settings" 
            element={
              isLoggedIn ? (
                <Settings />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
