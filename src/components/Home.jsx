import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';
import { FaVideo, FaUsers, FaLock, FaComments, FaDesktop, FaMicrophone, FaUserAlt, FaUserFriends, FaMobileAlt, FaLaptop, FaComment } from 'react-icons/fa';
import VideoMeetComponent from './VideoMeet';

gsap.registerPlugin(ScrollTrigger);

const Home = ({ userName, setUserName, isLoggedIn }) => {
  const [showJoinInput, setShowJoinInput] = useState(false);
  const [meetingCode, setMeetingCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(true);
  const [showVideoMeet, setShowVideoMeet] = useState(false);
  const [meetingAction, setMeetingAction] = useState(''); // 'create' or 'join'
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const locomotiveScrollRef = useRef(null);
  const heroSectionRef = useRef(null);

  useEffect(() => {
    locomotiveScrollRef.current = new LocomotiveScroll({
      el: containerRef.current,
      smooth: true,
      multiplier: 1,
      smartphone: {
        smooth: true,
      },
      tablet: {
        smooth: true,
      },
    });

    return () => {
      if (locomotiveScrollRef.current) {
        locomotiveScrollRef.current.destroy();
      }
    };
  }, []);

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from('.hero-title', {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: 'power4.out',
    })
    .from('.hero-subtitle', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, "-=1")
    .from('.join-card', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    }, "-=0.8");

    gsap.from('.feature-card', {
      y: 100,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.features-section',
        start: 'top 80%',
      }
    });

    gsap.from('.info-section', {
      y: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.info-section',
        start: 'top 80%',
      }
    });

    gsap.utils.toArray('.action-button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      });
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!userName.trim()) {
      const guestName = `Guest-${Math.floor(Math.random() * 10000)}`;
      setUserName(guestName);
    }
    
    if (!isCreating && !roomId.trim()) {
      alert('Please enter a room ID');
      return;
    }
    
    const targetRoomId = isCreating ? uuidv4() : roomId;
    
    navigate(`/room/${targetRoomId}`);
  };

  const validateAndJoinMeeting = async () => {
    setJoinError('');
    
    if (!meetingCode.trim()) {
      setJoinError('Please enter a meeting code');
      return;
    }
    
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(meetingCode.trim())) {
      setJoinError('Invalid meeting code. Please check and try again.');
      return;
    }
    
    try {
      
      const token = localStorage.getItem('token');
      
      let shouldProceed = true;
      
      
      if (token) {
        try {
          const response = await fetch(`http://localhost:5001/api/meetings/${meetingCode.trim()}/join`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          const data = await response.json();
          
          
          if (!response.ok && response.status === 404) {
            console.log("Meeting not found in database, but proceeding with valid UUID");
            
          } else if (!response.ok) {
            setJoinError(data.message || 'Failed to join meeting');
            shouldProceed = false;
          }
        } catch (error) {
          console.error("Error joining meeting via API:", error);
          
        }
      }
      
      if (shouldProceed) {
        
        sessionStorage.setItem('isCreatingMeeting', 'false');
        sessionStorage.setItem('joiningRoomId', meetingCode.trim());
        
        setRoomId(meetingCode.trim());
        setMeetingAction('join');
        setShowVideoMeet(true);
        setShowJoinInput(false);
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      setJoinError('Server error. Please try again later.');
    }
  };

  const handleCreateMeeting = async () => {
    
    const newRoomId = uuidv4();
    
    if (isLoggedIn) {
      try {
        const token = localStorage.getItem('token');
        
        if (token) {
          
          const response = await fetch('http://localhost:5001/api/meetings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              title: `Meeting by ${userName || 'User'}`,
              description: 'Video conference meeting',
              meetingId: newRoomId,
              settings: {
                allowChat: true,
                allowScreenShare: true,
                muteParticipantsOnEntry: false
              }
            })
          });
          
          const data = await response.json();
          
          if (!response.ok) {
            console.error('Failed to create meeting in database:', data.message);
            
          } else {
            console.log('Meeting created successfully in database');
          }
        }
      } catch (error) {
        console.error('Error creating meeting in database:', error);
        
      }
    } else {
      
      document.querySelector('.navbar-signup-button')?.click();
      return;
    }
    
    
    sessionStorage.setItem('isCreatingMeeting', 'true');
    sessionStorage.setItem('createdRoomId', newRoomId);
    
    setRoomId(newRoomId);
    setMeetingAction('create');
    setShowVideoMeet(true);
  };

  const handleCloseVideoMeet = () => {
    setShowVideoMeet(false);
    setMeetingAction('');
    setRoomId('');
  };

  return (
    <div className="relative overflow-x-hidden" 
         ref={containerRef} 
         data-scroll-container
         style={{
           backgroundImage: `url('https://cdn.pixabay.com/photo/2017/09/07/20/51/background-2726634_1280.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
           backgroundAttachment: 'fixed'
         }}
    >
      
      {showVideoMeet ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-90">
          <div className="relative w-full h-full">
            <button 
              className="absolute z-10 p-2 text-white bg-gray-800 rounded-full top-4 right-4 hover:bg-gray-700"
              onClick={handleCloseVideoMeet}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <VideoMeetComponent 
              roomId={roomId} 
              isCreator={meetingAction === 'create'} 
              userName={userName || `Guest-${Math.floor(Math.random() * 10000)}`}
              onJoinRoom={() => navigate(`/room/${roomId}`)}
            />
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen overflow-hidden cursor-pointer backdrop-blur-sm" ref={heroSectionRef}>
          
          <div className="container relative z-10 px-4 py-16 mx-auto" data-scroll-section>
            <div className="flex flex-col items-center justify-center">
              <div className="pt-8 mb-10 text-center">
                <h1 className="mb-4 text-6xl font-bold text-transparent hero-title md:text-7xl bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">Vidula</h1>
                <p className="text-base italic font-bold tracking-wide text-gray-700 md:text-lg hero-subtitle" style={{ fontFamily: "'Inter', sans-serif", lineHeight: '1.3', fontWeight: 700, letterSpacing: '-0.02em' }}>Vidula delivers the clarity, speed, and features you need to make it count.</p>
              </div>
            
              
              <div className="flex items-center justify-center w-full mt-6 mb-14">
                <div className="relative flex justify-center w-full max-w-sm md:max-w-md" style={{ marginTop: "-60px" }}>
                  <img 
                    src="https://img.freepik.com/free-vector/online-tutor-concept-illustration_114360-20569.jpg?t=st=1745756177~exp=1745759777~hmac=e2975b65d8eebb3dca706be0445b3d592f47d1c56ae8053b2b505a1d3ece3775&w=826" 
                    alt="Online tutor concept illustration" 
                    className="w-full max-w-md border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
              />
                </div>
            </div>
            
              <div className="flex flex-col items-center w-full max-w-md mx-auto mt-10">
              {!showJoinInput ? (
                  <div className="flex justify-center w-full gap-6 mb-8">
                  <button 
                    className="px-8 py-5 text-xl font-medium text-white transition-all duration-300 bg-red-600 rounded-lg shadow-lg action-button hover:bg-red-700"
                    onClick={handleCreateMeeting}
                  >
                    New Meeting
                  </button>
                  <button 
                    className="px-8 py-5 text-xl font-medium text-white transition-all duration-300 bg-gray-800 rounded-lg shadow-lg action-button hover:bg-gray-700"
                    onClick={() => {
                      if (isLoggedIn) {
                        setShowJoinInput(true);
                      } else {
                        document.querySelector('.navbar-signup-button').click();
                      }
                    }}
                  >
                    Join Meeting
                  </button>
                </div>
              ) : (
                  <div className="w-full max-w-md p-6 mb-8 transition-all duration-300 border border-gray-200 rounded-lg shadow-lg bg-opacity-80 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-medium text-gray-800">Join a Meeting</h3>
                    <button 
                      onClick={() => {
                        setShowJoinInput(false);
                        setJoinError('');
                        setMeetingCode('');
                      }}
                      className="text-gray-500 transition-colors duration-200 hover:text-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Enter meeting code"
                      className="w-full px-4 py-3 text-gray-800 bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      value={meetingCode}
                      onChange={(e) => {
                        setMeetingCode(e.target.value);
                        setJoinError('');
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          validateAndJoinMeeting();
                        }
                      }}
                    />
                    {joinError && (
                      <div className="mt-2 text-sm text-red-500">
                        {joinError}
                      </div>
                    )}
                  </div>
                  <button
                    className="w-full py-3 font-medium text-white transition-colors duration-200 bg-red-600 rounded-md hover:bg-red-700"
                    onClick={validateAndJoinMeeting}
                  >
                    Join
                  </button>
                </div>
              )}
              </div>
            </div>
          </div>

          
          <div className="absolute text-gray-700 transform -translate-x-1/2 bottom-8 left-1/2 animate-bounce">
            <p className="mb-2 text-sm">Scroll Down</p>
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      )}
      
      <div className="relative py-24 overflow-hidden text-gray-800 backdrop-blur-sm creative-text-section" data-scroll-section>
        <div className="container px-4 mx-auto">
          <div className="max-w-5xl mx-auto">
            
           
            <div className="mb-32 creative-text-block" data-scroll data-scroll-speed="0.5">
              <style jsx>{`
                @keyframes gradientAnimation {
                  0% { background-position: 0% 50%; }
                  50% { background-position: 100% 50%; }
                  100% { background-position: 0% 50%; }
                }
                .animated-gradient {
                  background: linear-gradient(to right, 
                    #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #8b00ff, #ff0000);
                  background-size: 200% auto;
                  color: transparent !important;
                  -webkit-background-clip: text;
                  background-clip: text;
                  animation: gradientAnimation 6s linear infinite;
                }
              `}</style>
              <h2 className="mb-6 text-6xl font-bold text-transparent animated-gradient md:text-8xl creative-heading">
                Creating More than Web Apps
              </h2>
              <h2 className="text-5xl font-bold text-transparent animated-gradient md:text-7xl creative-heading-2">
                Delivering <span className="italic">Experiences</span>
              </h2>
            </div>
            
            
            <div className="mb-32 creative-text-block" data-scroll data-scroll-speed="0.3">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="md:w-1/2">
                  <h3 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl creative-subheading">
                    <span className="text-red-500">Connect</span> Without Boundaries
                  </h3>
                  <p className="text-xl leading-relaxed text-gray-700 animated-text">
                    Distance is just a number. With Vidula, your team feels like they're in the same room, no matter where they are in the world.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2">
                  <img 
                    src="https://img.freepik.com/free-vector/remote-team-concept-illustration_114360-4493.jpg?t=st=1745755032~exp=1745758632~hmac=7ff01d41fd2220dc543a82a0ab3c31d11b93430634f194959e58ff5e75ef4c74&w=1380" 
                    alt="Remote team concept illustration" 
                    className="w-full max-w-md border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
              </div>
            </div>
            
            
            <div className="creative-text-block" data-scroll data-scroll-speed="0.4">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row-reverse">
                <div className="md:w-1/2">
                  <h3 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl creative-subheading">
                    Crystal <span className="text-red-500">Clear</span> Communication
                  </h3>
                  <p className="text-xl leading-relaxed text-gray-700 animated-text">
                    Every expression, every nuance, captured in stunning HD. Because in real conversations, what's not said matters just as much as what is.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2">
                  <img 
                    src="https://img.freepik.com/free-vector/online-christmas-celebration_23-2148763702.jpg?t=st=1745756629~exp=1745760229~hmac=44173ecc397282ffcc3ebe1bc5a5824f0248882a561b4412c8fd25b6d0110c6e&w=900" 
                    alt="Online celebration illustration" 
                    className="w-full max-w-md border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
              </div>
            </div>
            
            {/* Add device section */}
            <div className="mb-32 creative-text-block" data-scroll data-scroll-speed="0.4">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row">
                <div className="md:w-1/2">
                  <h3 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl creative-subheading">
                    <span className="text-red-500">Any</span> Device, Anywhere
                  </h3>
                  <p className="text-xl leading-relaxed text-gray-700 animated-text">
                    Join meetings seamlessly from your desktop, tablet, or phone. Vidula adapts to your lifestyle and work preferences.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2">
                  <img 
                    src="https://img.freepik.com/free-vector/illustrated-best-friends-video-calling_23-2148504107.jpg?t=st=1745757045~exp=1745760645~hmac=a03bcd5dfedb90fda331a186c3afae6a02805982c7fb56da026e148e04a80f18&w=826" 
                    alt="Best friends video calling illustration" 
                    className="w-full max-w-md border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
              </div>
            </div>
            
            {/* Add teamwork section */}
            <div className="mb-32 creative-text-block" data-scroll data-scroll-speed="0.4">
              <div className="flex flex-col items-center justify-between gap-8 md:flex-row-reverse">
                <div className="md:w-1/2">
                  <h3 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl creative-subheading">
                    <span className="text-red-500">Team</span> Collaboration Reimagined
                  </h3>
                  <p className="text-xl leading-relaxed text-gray-700 animated-text">
                    Share ideas, screens, and breakthroughs in real-time. Vidula brings your team's collective genius into one virtual space.
                  </p>
                </div>
                <div className="flex justify-center md:w-1/2">
                  <img 
                    src="https://img.freepik.com/free-vector/employees-working-from-home-concept_52683-41250.jpg?t=st=1745757426~exp=1745761026~hmac=58ec4bf9027f8e48cd56e14d67582403dcbdcb199419ed381a2c6be373a39dc4&w=826" 
                    alt="Employees working from home illustration" 
                    className="w-full max-w-md border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      
      
      <div id="how-it-works" className="relative pt-12 pb-24 overflow-hidden text-gray-800 backdrop-blur-sm how-it-works-section" data-scroll-section>
        <div className="container px-4 mx-auto">
          <h2 className="mb-16 text-4xl font-bold text-center text-gray-800">How It Works</h2>
          
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img 
                    src="https://img.freepik.com/free-vector/sign-up-concept-illustration_114360-7885.jpg?t=st=1745757716~exp=1745761316~hmac=5b39b19897e9ff07a622e7a2b9e61d9c4edf0d8ae5d08a1e7ea054a80b182171&w=826"
                    alt="Sign up concept illustration"
                    className="object-contain w-40 h-40 border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">Create Account</h3>
                <p className="text-gray-700">Sign up for a free account using the navigation bar above to get started.</p>
              </div>
              
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img 
                    src="https://img.freepik.com/free-vector/flat-online-medical-conference-illustration_23-2148890146.jpg?t=st=1745758165~exp=1745761765~hmac=afc80f5a44d6e73a5cfc5a2878191df845a8bca2cbd411788aba6f615e1a9d7c&w=826"
                    alt="Online conference illustration"
                    className="object-contain w-40 h-40 border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">Start or Join</h3>
                <p className="text-gray-700">Create a new meeting or join an existing one with a simple click.</p>
              </div>
              
              <div className="p-6 text-center">
                <div className="flex items-center justify-center mx-auto mb-4">
                  <img 
                    src="https://img.freepik.com/free-vector/hand-drawn-dinner-party-illustration_52683-119288.jpg?t=st=1745758495~exp=1745762095~hmac=175b1cb019e8aa9013cce858969557bd8407689c67539525f0ddf10ad78f351d&w=1380"
                    alt="Dinner party illustration"
                    className="object-contain w-40 h-40 border-4 shadow-lg rounded-3xl border-yellow-300/30"
                    style={{ filter: "hue-rotate(15deg) saturate(1.4) brightness(1.05)" }}
                  />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-800">Collaborate</h3>
                <p className="text-gray-700">Enjoy HD video conferencing with all the tools you need for productive meetings.</p>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <p className="max-w-3xl mx-auto mb-8 text-lg text-gray-700">
                Getting started with Vidula is easy. Sign up today and experience the difference of professional-grade video conferencing.
              </p>
            </div>
          </div>
        </div>
      </div>

      
      <footer className="relative py-12 overflow-hidden text-gray-800 border-t border-gray-200 backdrop-blur-sm" data-scroll-section>
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between md:flex-row">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800">Vidula</h2>
              <p className="mt-2 text-gray-600">Professional Video Conferencing</p>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-600">© 2025 Vidula. All rights reserved.</p>
              <div className="mt-2">
                <a href="#" className="mr-4 text-gray-600 hover:text-red-500">Privacy Policy</a>
                <a href="#" className="text-gray-600 hover:text-red-500">Terms of Service</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
