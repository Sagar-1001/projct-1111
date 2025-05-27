import React, { useEffect, useRef } from 'react';
import { FaVideo, FaUsers, FaLock, FaComments, FaDesktop, FaMicrophone, FaCheck, FaGlobe, FaMobile, FaLaptop, FaArrowRight } from 'react-icons/fa';
import Canvas from '../Canvas';

const Features = () => {
  const featuresRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);

  
  const features = [
    {
      title: "HD Video Quality",
      image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
      points: [
        "Crystal clear 1080p resolution for professional meetings",
        "Adaptive quality that adjusts to your connection speed"
      ]
    },
    {
      title: "Multiple Participants",
      image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      points: [
        "Connect with up to 100 participants simultaneously",
        "Perfect for team meetings, webinars, and virtual events"
      ]
    },
    {
      title: "Enterprise Security",
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      points: [
        "End-to-end encryption for complete privacy",
        "Secure access codes and waiting room functionality"
      ]
    },
    {
      title: "Interactive Chat",
      image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      points: [
        "Send messages and share files during your call",
        "Keep conversations flowing with emoji reactions"
      ]
    },
    {
      title: "Advanced Screen Sharing",
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      points: [
        "Share your screen, window, or browser tab with ease",
        "Annotate content in real-time for better collaboration"
      ]
    },
    {
      title: "Professional Audio",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80",
      points: [
        "AI noise cancellation for crystal clear sound",
        "Individual audio controls for complete flexibility"
      ]
    }
  ];

  
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Marketing Director",
      company: "Global Innovations",
      image: "https://img.freepik.com/free-vector/businesswoman-character-avatar-isolated_24877-60111.jpg",
      bgColor: "#f0f9ff", 
      quote: "Vidula has transformed how our marketing team collaborates with clients worldwide. The video quality is outstanding and the platform is incredibly reliable."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      company: "TechForward",
      image: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg",
      bgColor: "#f0fdf4", 
      quote: "As a technology company, we demand the best tools. Vidula's security features and API flexibility have made it our go-to platform for all virtual meetings."
    },
    {
      name: "Emma Rodriguez",
      role: "Remote Learning Coordinator",
      company: "Education First",
      image: "https://img.freepik.com/free-vector/teacher-character-avatar-isolated_24877-60111.jpg",
      bgColor: "#fef2f2", 
      quote: "Our students and faculty have seamlessly adapted to Vidula for virtual classrooms. The interface is intuitive and the features support engaging learning experiences."
    }
  ];

  
  const additionalBenefits = [
    {
      icon: <FaGlobe className="text-3xl text-red-600" />,
      title: "Global Infrastructure",
      description: "Servers strategically located worldwide ensure low-latency connections for users in any region.",
      bgColor: "#f0f9ff", 
      image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1472&q=80"
    },
    {
      icon: <FaMobile className="text-3xl text-red-600" />,
      title: "Mobile Optimized",
      description: "Fully responsive design works flawlessly on smartphones and tablets with native-like performance.",
      bgColor: "#f0fdf4", 
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: <FaLaptop className="text-3xl text-red-600" />,
      title: "Browser Based",
      description: "No downloads required. Join meetings directly from your browser without installing software.",
      bgColor: "#faf5ff", 
      image: "https://images.unsplash.com/photo-1607706189992-eae578626c86?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    },
    {
      icon: <FaCheck className="text-3xl text-red-600" />,
      title: "99.9% Uptime",
      description: "Enterprise-grade reliability ensures your meetings are never interrupted by service outages.",
      bgColor: "#fef2f2", 
      image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
    }
  ];

  

  return (
    <div className="relative min-h-screen overflow-hidden text-gray-800" ref={featuresRef} style={{ 
      scrollbarWidth: 'none', 
      msOverflowStyle: 'none',
      backgroundImage: `url('https://cdn.pixabay.com/photo/2024/12/17/19/34/waves-9273752_1280.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      
      
      
      <div className="container relative z-10 px-4 py-24 mx-auto">
        {/* Main title */}
        <div ref={titleRef} className="p-6 mb-16 text-center rounded-xl backdrop-blur-md">
          <h1 className="mb-6 text-5xl font-bold text-transparent md:text-6xl bg-clip-text bg-gradient-to-r from-green-500 via-yellow-500 to-blue-400">Premium Features</h1>
          <p className="max-w-3xl mx-auto text-xl font-semibold text-gray-800 drop-shadow-md">Discover why Vidula is the preferred choice for professionals worldwide.</p>
        </div>
        
        
        <div className="mb-24 space-y-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              ref={el => cardsRef.current[index] = el}
              className="overflow-hidden transition-all duration-300 border feature-card rounded-xl backdrop-blur-md border-green-200/50"
            >
              <div className="flex flex-col w-full md:flex-row">
                
                <div className="flex items-center justify-center p-6 overflow-hidden h-80 md:w-1/2 md:h-auto">
                  <div className="relative flex items-center justify-center w-80 h-80">
                    <div className="absolute inset-0 rounded-lg"></div>
                    <img 
                      src={feature.image} 
                      alt={feature.title} 
                      className="relative z-10 object-cover w-full h-full rounded-lg"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/500x300/ffffff/dc2626?text=Vidula';
                      }}
                      style={{ 
                        filter: 'brightness(1.2) contrast(1.1)',
                        opacity: '1'
                      }}
                    />
                  </div>
                </div>
                
                
                <div className="flex flex-col justify-center p-8 pl-12 md:w-1/2">
                <h3 className="mb-6 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400" style={{marginLeft: '-20px'}}>{feature.title}</h3>
                
                
                <ul className="space-y-6">
                  {feature.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="mt-1 mr-3 text-yellow-600"><FaArrowRight /></span>
                      <p className="text-lg font-medium text-gray-800 drop-shadow-md">{point}</p>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        
        <div ref={benefitsRef} className="py-16 mb-24 rounded-xl backdrop-blur-md">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">Why Choose Vidula?</h2>
          
          <div className="grid grid-cols-1 gap-8 px-8 md:grid-cols-2 lg:grid-cols-4">
            {additionalBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="p-6 transition-all duration-300 border rounded-lg backdrop-blur-md border-green-200/50"
              >
                
                <div className="flex items-center justify-center h-48 mb-4 overflow-hidden rounded-lg">
                  <div className="relative flex items-center justify-center w-48 h-48">
                    <div className="absolute inset-0 rounded-lg"></div>
                    <img 
                      src={benefit.image} 
                      alt={benefit.title} 
                      className="relative z-10 object-cover w-full h-full"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/300x200/ffffff/dc2626?text=Vidula';
                      }}
                      style={{ 
                        filter: 'brightness(1.2) contrast(1.1)',
                        opacity: '1'
                      }}
                    />
                  </div>
                </div>
                <h4 className="mb-3 text-xl font-semibold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">{benefit.title}</h4>
                <p className="text-center text-gray-800 drop-shadow-md">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        
        <div ref={testimonialsRef} className="py-16 rounded-xl backdrop-blur-md">
          <h2 className="mb-16 text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">What Our Users Say</h2>
          
          <div className="grid grid-cols-1 gap-8 px-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className="relative p-8 transition-all duration-300 border rounded-xl backdrop-blur-md border-green-200/50"
              >
                <div className="absolute p-1 transform -translate-x-1/2 rounded-full -top-5 left-1/2 bg-gradient-to-r from-green-400 to-blue-400">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name} 
                    className="object-cover w-16 h-16 border-2 border-white rounded-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150/ffffff/dc2626?text=V';
                    }}
                  />
                </div>
                <div className="pt-10 text-center">
                  <p className="mb-6 italic text-gray-800">"{testimonial.quote}"</p>
                  <h4 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">{testimonial.name}</h4>
                  <p className="text-sm text-gray-700">{testimonial.role}</p>
                  <p className="text-sm font-semibold text-yellow-600">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
