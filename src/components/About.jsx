import { useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const treeContainerRef = useRef(null);
  const navigate = useNavigate();
  
  
  const aboutInfo = [
    {
      title: "Our Mission",
      description: "To create seamless video conferencing that brings people together regardless of distance."
    },
    {
      title: "Founded",
      description: "Established in 2023 by a team of passionate developers and designers."
    },
    {
      title: "Our Technology",
      description: "Built with cutting-edge WebRTC technology for real-time, high-quality video calls."
    },
    {
      title: "Security",
      description: "End-to-end encryption ensures your conversations remain private and secure."
    },
    {
      title: "Accessibility",
      description: "Designed with accessibility in mind to be usable by everyone."
    },
    {
      title: "Global Reach",
      description: "Connecting users across 150+ countries with low-latency infrastructure."
    },
    {
      title: "Our Values",
      description: "Privacy, innovation, and human connection are at the core of everything we do."
    }
  ];

  useGSAP(() => {
    
    gsap.utils.toArray('.info-card').forEach((card, index) => {
      gsap.from(card, {
        opacity: 0,
        scale: 0.8,
        duration: 1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          end: 'top 60%',
          scrub: 0.5,
          toggleActions: 'play none none reverse'
        }
      });
    });
  }, []);

  return (
    <div 
      className="relative w-full min-h-screen pt-16 pb-32 overflow-hidden" 
      style={{ 
        scrollbarWidth: 'none', 
        msOverflowStyle: 'none',
        backgroundImage: `url('https://cdn.pixabay.com/photo/2020/03/12/13/50/illustration-4925149_1280.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundColor: '#f0f8ff',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="container w-full px-4 mx-auto">
        <h1 className="mb-8 text-5xl font-bold text-center text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">About Vidula</h1>
        
        <div className="max-w-4xl p-8 mx-auto mb-20 rounded-xl backdrop-blur-md bg-white/40"
          style={{ 
            border: '1px solid rgba(138, 75, 255, 0.2)',
            boxShadow: '0 10px 25px -5px rgba(138, 75, 255, 0.1), 0 8px 10px -6px rgba(138, 75, 255, 0.05)'
          }}>
          <p className="text-xl font-bold leading-relaxed text-center text-gray-700 animated-gradient-text">
            Vidula is a next-generation video conferencing platform designed to make virtual meetings feel as natural and productive as in-person collaboration. Our mission is to break down the barriers of distance and bring people together through technology.
          </p>
        </div>
        
        
        <div ref={treeContainerRef} className="info-container relative w-full mx-auto min-h-[1000px]">
          {/* Info cards */}
          {aboutInfo.map((info, index) => {
            const isEven = index % 2 === 0;
            const topPosition = 100 + index * 120;
            
            return (
              <div key={index} className="relative" style={{ top: `${topPosition}px` }}>
                {/* Info card */}
                <div 
                  className={`info-card absolute w-80 p-6 rounded-xl transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px] backdrop-blur-md bg-white/50`}
                  style={{ 
                    left: isEven ? `calc(50% + 50px)` : `calc(50% - 330px)`,
                    top: `-40px`,
                    border: '1px solid rgba(255, 186, 8, 0.2)',
                    boxShadow: '0 10px 25px -5px rgba(255, 186, 8, 0.1), 0 8px 10px -6px rgba(255, 186, 8, 0.05)'
                  }}
                >
                  <h3 className="mb-3 text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400">{info.title}</h3>
                  <p className="text-center text-gray-700">{info.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="max-w-4xl mx-auto mt-32 text-center">
          <div className="p-10 transition-all duration-300 rounded-xl hover:shadow-xl backdrop-blur-md bg-white/50"
            style={{ 
              border: '1px solid rgba(255, 186, 8, 0.2)',
              boxShadow: '0 10px 25px -5px rgba(255, 186, 8, 0.1), 0 8px 10px -6px rgba(255, 186, 8, 0.05)'
            }}>
            <h2 className="mb-8 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-yellow-400">Join Us on Our Journey</h2>
            <p className="mb-10 text-xl leading-relaxed text-gray-700">
            We're constantly evolving and improving our platform to create the best possible experience for our users. Join us on this journey to redefine how the world connects virtually.
          </p>
          <button 
            onClick={() => {
              
              navigate('/');
              
              setTimeout(() => {
                
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }, 100);
            }} 
              className="px-10 py-5 text-lg font-bold text-white transition-all duration-300 transform rounded-full shadow-lg cursor-pointer bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 hover:scale-105"
          >
            Get Started Today
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
