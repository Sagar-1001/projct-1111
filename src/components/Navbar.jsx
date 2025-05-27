import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaVideo, FaUser } from 'react-icons/fa';
import PenguinEyes from './PenguinEyes';

const Navbar = ({ isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isContactPage = location.pathname === '/contact';
  const isHomePage = location.pathname === '/';
  const isFeaturesPage = location.pathname === '/features';
  const isAboutPage = location.pathname === '/about';
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loginEyesClosed, setLoginEyesClosed] = useState(false);
  const [signupEyesClosed, setSignupEyesClosed] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  
  
  const dropdownRef = useRef(null);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  
  const navigateAndScrollToTop = (path) => {
    navigate(path);
    
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }, 100);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
   
    setLoginError('');
    
    try {
      
      const isEmail = email.includes('@');
      
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: email, 
          password 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        
        setIsLoggedIn(true);
        setCurrentUser({ email, name: data.user.username });
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setShowLoginModal(false);
        setEmail('');
        setPassword('');
      } else {
        
        setLoginError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Server error. Please try again later.');
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    
    setSignupError('');
    
    if (email && password && name) {
      try {
        const response = await fetch('http://localhost:5000/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            username: name, 
            password, 
            email 
          }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          setSignupError(data.message || 'Registration failed. Please try again.');
          return;
        }
        
        const data = await response.json();
        
        
        closeSignupModal();
        
        
        setTimeout(() => {
          setShowLoginModal(true);
          setEmail(email); 
        }, 100);
        
        
        setLoginError('Account created successfully! Please log in to continue.');
      } catch (error) {
        console.error('Signup error:', error);
        setSignupError('Server error. Please try again later.');
      }
    } else {
      setSignupError('Please fill in all fields');
    }
  };

  const handleLogout = () => {
   
    setIsLoggedIn(false);
    setCurrentUser(null);
    
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
    
    
    if (window.location.pathname !== '/') {
      navigateAndScrollToTop('/');
    }
  };

  
  const resetLoginForm = () => {
    setEmail('');
    setPassword('');
    setLoginError('');
  };

  
  const resetSignupForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setSignupError('');
  };

  
  const closeLoginModal = () => {
    setShowLoginModal(false);
    resetLoginForm();
  };

  
  const closeSignupModal = () => {
    setShowSignupModal(false);
    resetSignupForm();
  };

  useEffect(() => {
    if (showSignupModal || showLoginModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSignupModal, showLoginModal]);

  return (
    <>
      <nav className={`fixed z-50 w-full transition-all duration-300 border-0 border-none ${
        isContactPage ? 'bg-[#B6E5F2]' : 
        isAboutPage ? 'bg-gradient-to-b from-sky-50 to-blue-50' :
        isFeaturesPage ? '' :
        'bg-[#F1C40F]'
      }`}
      style={{ 
        borderBottom: 'none',
        ...(isFeaturesPage ? {
          backgroundImage: `url('https://cdn.pixabay.com/photo/2024/12/17/19/34/waves-9273752_1280.jpg')`,
          backgroundSize: '120% 5000%',
          backgroundPosition: 'center 6.8%',
          backgroundRepeat: 'no-repeat',
          height: '80px',
          backgroundAttachment: 'scroll'
        } : {})
      }}>
        <div className="container px-6 mx-auto">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button onClick={() => navigateAndScrollToTop('/')} className="flex items-center bg-transparent border-none cursor-pointer">
              <div className="w-10 h-10">
                <img src="/vidula-new-logo.svg" alt="Vidula Logo" className="object-contain w-full h-full" />
              </div>
              <span className="ml-2 text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">Vidula</span>
            </button>

            
            <div className="items-center hidden space-x-6 md:flex">
              <button onClick={() => navigateAndScrollToTop('/')} className={`px-3 py-2 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isHomePage ? 'text-red-500 font-semibold' : 
                isContactPage ? 'text-teal-800 hover:text-pink-500' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500' :
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500' :
                'text-gray-800 hover:text-red-500'
              }`}>Home</button>
              <button onClick={() => navigateAndScrollToTop('/features')} className={`px-3 py-2 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isFeaturesPage ? 'text-indigo-500 font-semibold' : 
                isContactPage ? 'text-teal-800 hover:text-pink-500' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500' :
                'text-gray-800 hover:text-red-500'
              }`}>Features</button>
              <button onClick={() => navigateAndScrollToTop('/about')} className={`px-3 py-2 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isAboutPage ? 'text-blue-500 font-semibold' : 
                isContactPage ? 'text-teal-800 hover:text-pink-500' : 
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500' :
                'text-gray-800 hover:text-red-500'
              }`}>About</button>
              <button onClick={() => navigateAndScrollToTop('/contact')} className={`px-3 py-2 font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer ${
                isContactPage ? 'text-pink-500 font-semibold' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500' :
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500' :
                'text-gray-800 hover:text-red-500'
              }`}>Contact</button>
              
              {isLoggedIn ? (
                <div className="flex items-center ml-4">
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      className={`flex items-center px-3 py-2 space-x-2 text-white transition-colors duration-200 rounded-full ${
                        isContactPage ? 'bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500' : 
                        isAboutPage ? 'bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500' :
                        isFeaturesPage ? 'bg-gradient-to-r from-indigo-500 to-purple-400 hover:from-indigo-600 hover:to-purple-500' :
                        'bg-red-600 hover:bg-red-700'
                      }`}
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <FaUser className="text-white" />
                      <span>{currentUser?.name || 'User'}</span>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute right-0 z-50 w-48 py-2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl">
                        <Link to="/profile" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-red-50">Profile</Link>
                        <Link to="/settings" onClick={() => setIsDropdownOpen(false)} className="block px-4 py-2 text-gray-800 transition-colors duration-200 hover:bg-red-50">Settings</Link>
                        <button 
                          onClick={() => {
                            handleLogout();
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full px-4 py-2 text-left text-gray-800 transition-colors duration-200 hover:bg-red-50 logout-button"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center ml-4 space-x-4">
                  <button 
                    onClick={() => setShowLoginModal(true)} 
                    className="px-3 py-2 text-gray-800 transition-colors duration-200 hover:text-red-500 navbar-login-button"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => setShowSignupModal(true)} 
                    className="px-5 py-2 text-white transition-all duration-200 bg-red-600 rounded-full hover:bg-red-700 navbar-signup-button"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            
            <div className="flex items-center md:hidden">
              <button onClick={toggleMenu} className="text-gray-800 transition-colors duration-200 hover:text-red-500 focus:outline-none">
                {isMenuOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 sm:px-3 ${
              isContactPage ? 'bg-[#B6E5F2]' :
              isAboutPage ? 'bg-gradient-to-b from-sky-50 to-blue-50' :
              isFeaturesPage ? '' :
              'bg-[#F1C40F]'
            }`}
            style={isFeaturesPage ? {
              backgroundImage: `url('https://cdn.pixabay.com/photo/2024/12/17/19/34/waves-9273752_1280.jpg')`,
              backgroundSize: '120% 5000%',
              backgroundPosition: 'center 6.8%',
              backgroundRepeat: 'no-repeat',
              backgroundAttachment: 'scroll'
            } : {}}>
              <button onClick={() => {
                navigateAndScrollToTop('/');
                setIsMenuOpen(false);
              }} className={`block w-full px-3 py-2 font-medium text-left transition-colors duration-200 rounded-md ${
                isHomePage ? 'text-red-500 font-semibold bg-red-50' :
                isContactPage ? 'text-teal-800 hover:text-pink-500 hover:bg-teal-100' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500 hover:bg-blue-100' :
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500 hover:bg-purple-100' :
                'text-gray-800 hover:text-red-500 hover:bg-gray-50'
              }`}>
                Home
              </button>
              <button onClick={() => {
                navigateAndScrollToTop('/features');
                setIsMenuOpen(false);
              }} className={`block w-full px-3 py-2 font-medium text-left transition-colors duration-200 rounded-md ${
                isFeaturesPage ? 'text-indigo-500 font-semibold bg-indigo-50' :
                isContactPage ? 'text-teal-800 hover:text-pink-500 hover:bg-teal-100' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500 hover:bg-blue-100' :
                'text-gray-800 hover:text-red-500 hover:bg-gray-50'
              }`}>
                Features
              </button>
              <button onClick={() => {
                navigateAndScrollToTop('/about');
                setIsMenuOpen(false);
              }} className={`block w-full px-3 py-2 font-medium text-left transition-colors duration-200 rounded-md ${
                isAboutPage ? 'text-blue-500 font-semibold bg-blue-50' :
                isContactPage ? 'text-teal-800 hover:text-pink-500 hover:bg-teal-100' : 
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500 hover:bg-purple-100' :
                'text-gray-800 hover:text-red-500 hover:bg-gray-50'
              }`}>
                About
              </button>
              <button onClick={() => {
                navigateAndScrollToTop('/contact');
                setIsMenuOpen(false);
              }} className={`block w-full px-3 py-2 font-medium text-left transition-colors duration-200 rounded-md ${
                isContactPage ? 'text-pink-500 font-semibold bg-pink-50' : 
                isAboutPage ? 'text-blue-800 hover:text-blue-500 hover:bg-blue-100' :
                isFeaturesPage ? 'text-purple-800 hover:text-indigo-500 hover:bg-purple-100' :
                'text-gray-800 hover:text-red-500 hover:bg-gray-50'
              }`}>
                Contact
              </button>
              
              {isLoggedIn ? (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <FaUser className="w-6 h-6 text-gray-800" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-800">{currentUser?.name || 'User'}</div>
                      <div className="text-sm font-medium text-gray-500">{currentUser?.email || ''}</div>
                    </div>
                  </div>
                  <div className="px-2 mt-3 space-y-1">
                    <Link 
                      to="/profile" 
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-800 transition-colors duration-200 rounded-md hover:text-red-500 hover:bg-gray-50"
                    >
                      Profile
                    </Link>
                    <Link 
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-2 text-base font-medium text-gray-800 transition-colors duration-200 rounded-md hover:text-red-500 hover:bg-gray-50"
                    >
                      Settings
                    </Link>
                    <button 
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full px-3 py-2 text-base font-medium text-left text-gray-800 transition-colors duration-200 rounded-md hover:text-red-500 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 pb-3 border-t border-gray-200">
                  <button 
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-base font-medium text-left text-gray-800 transition-colors duration-200 rounded-md hover:text-red-500 hover:bg-gray-50"
                  >
                    Login
                  </button>
                  <button 
                    onClick={() => {
                      setShowSignupModal(true);
                      setIsMenuOpen(false);
                    }}
                    className="block w-full px-3 py-2 mt-1 text-base font-medium text-left text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

     
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 border border-red-100 shadow-2xl bg-white/95 backdrop-blur-md rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-600">Login</h2>
              <button 
                onClick={() => closeLoginModal()}
                className="text-gray-400 transition-colors duration-200 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 font-medium text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute w-24 h-24 transform -translate-x-1/2 pointer-events-none -top-16 left-1/2">
                    <PenguinEyes eyesClosed={loginEyesClosed} />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setLoginEyesClosed(true)}
                    onBlur={() => setLoginEyesClosed(false)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              {loginError && (
                <div className={`p-2 text-sm text-white rounded-md ${loginError.includes('successfully') ? 'bg-green-600' : 'bg-red-600'}`}>
                  {loginError}
                </div>
              )}
              <button 
                type="submit" 
                className="w-full py-3 mt-4 font-medium text-white transition-all duration-300 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Login
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <button 
                  onClick={() => {
                    closeLoginModal();
                    setShowSignupModal(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Sign up
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

     
      {showSignupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-md p-8 border border-red-100 shadow-2xl bg-white/95 backdrop-blur-md rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-600">Sign Up</h2>
              <button 
                onClick={() => closeSignupModal()}
                className="text-gray-400 transition-colors duration-200 hover:text-red-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-600">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="signupEmail" className="block mb-2 font-medium text-gray-600">Email</label>
                <input
                  type="email"
                  id="signupEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="signupPassword" className="block mb-2 font-medium text-gray-600">Password</label>
                <div className="relative">
                  <div className="absolute w-24 h-24 transform -translate-x-1/2 pointer-events-none -top-16 left-1/2">
                    <PenguinEyes eyesClosed={signupEyesClosed} />
                  </div>
                  <input
                    type="password"
                    id="signupPassword"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setSignupEyesClosed(true)}
                    onBlur={() => setSignupEyesClosed(false)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>
              
              {signupError && (
                <div className="p-2 text-sm text-white bg-red-600 rounded-md">
                  {signupError}
                </div>
              )}
              
              <button 
                type="submit" 
                className="w-full py-3 mt-4 font-medium text-white transition-all duration-300 bg-red-600 rounded-lg hover:bg-red-700"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <button 
                  onClick={() => {
                    closeSignupModal();
                    setShowLoginModal(true);
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
