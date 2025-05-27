import React, { useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';


gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const formRef = useRef(null);
  
  
  const backgroundImages = [
    '/contact-vectors/video-call-illustration-1.svg',
    '/contact-vectors/video-call-illustration-2.svg',
    '/contact-vectors/video-call-illustration-3.svg',
    '/contact-vectors/video-call-illustration-4.svg',
  ];

  useGSAP(() => {
    
    gsap.from('.contact-title', {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    });

    gsap.from('.contact-subtitle', {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    });

    gsap.from('.contact-info-item', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out',
      delay: 0.5,
    });

    gsap.from('.contact-form', {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.7,
      ease: 'power3.out',
    });

    gsap.from('.background-image', {
      scale: 0.8,
      opacity: 0,
      duration: 1.5,
      stagger: 0.3,
      ease: 'power3.out',
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    alert('Your message has been sent! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <div 
      className="relative min-h-screen pt-20 pb-16 overflow-hidden text-gray-800 bg-white"
      style={{
        backgroundImage: 'url("https://img.freepik.com/free-photo/vintage-pink-telephone-composition_23-2148913955.jpg?t=st=1745760150~exp=1745763750~hmac=b740626ecaee8ec987e54890c1790de167a67db862f30777690ffef0fa72d689&w=1380")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      
      <div className="absolute inset-0 bg-transparent"></div>

      
      <div className="absolute inset-0 z-0 overflow-hidden opacity-10">
        <div className="absolute top-0 right-0 transform background-image w-96 h-96 opacity-20 rotate-12">
          <img src={backgroundImages[0]} alt="Video call illustration" className="w-full h-full" />
        </div>
        <div className="absolute bottom-0 left-0 transform background-image w-80 h-80 opacity-20 -rotate-12">
          <img src={backgroundImages[1]} alt="Video call illustration" className="w-full h-full" />
        </div>
        <div className="absolute w-64 h-64 transform rotate-45 background-image top-1/4 left-1/4 opacity-15">
          <img src={backgroundImages[2]} alt="Video call illustration" className="w-full h-full" />
        </div>
        <div className="absolute transform background-image w-72 h-72 bottom-1/4 right-1/4 opacity-15 -rotate-15">
          <img src={backgroundImages[3]} alt="Video call illustration" className="w-full h-full" />
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto">
        <h1 className="mb-4 text-5xl font-bold text-center text-transparent contact-title bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-pink-600">Get In Touch</h1>
        <p className="max-w-2xl p-2 mx-auto mb-16 text-xl text-center text-teal-800 bg-white rounded-lg contact-subtitle bg-opacity-70">
          Have questions about Vidula? Need help setting up your first video conference? Our team is here to help you.
        </p>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          
          <div className="p-8 bg-white border border-teal-200 rounded-lg shadow-lg bg-opacity-90 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start contact-info-item">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-pink-100 rounded-full">
                  <FaEnvelope className="text-xl text-pink-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-800">Email Us</h3>
                  <p className="text-teal-700">support@vidula.com</p>
                  <p className="text-teal-700">info@vidula.com</p>
                </div>
              </div>

              <div className="flex items-start contact-info-item">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-pink-100 rounded-full">
                  <FaPhone className="text-xl text-pink-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-800">Call Us</h3>
                  <p className="text-teal-700">+1 (555) 123-4567</p>
                  <p className="text-teal-700">+1 (555) 987-6543</p>
                </div>
              </div>

              <div className="flex items-start contact-info-item">
                <div className="flex items-center justify-center w-12 h-12 mr-4 bg-pink-100 rounded-full">
                  <FaMapMarkerAlt className="text-xl text-pink-500" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-teal-800">Visit Us</h3>
                  <p className="text-teal-700">123 Tech Plaza, Suite 400</p>
                  <p className="text-teal-700">San Francisco, CA 94107</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-semibold text-teal-800">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="flex items-center justify-center w-10 h-10 text-pink-500 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-teal-600 hover:text-white">
                  <FaLinkedin />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 text-pink-500 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-teal-500 hover:text-white">
                  <FaTwitter />
                </a>
                <a href="#" className="flex items-center justify-center w-10 h-10 text-pink-500 transition-colors duration-300 bg-pink-100 rounded-full hover:bg-pink-500 hover:text-white">
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>

          
          <div className="p-8 bg-white border border-teal-200 rounded-lg shadow-lg contact-form bg-opacity-90 backdrop-blur-sm">
            <h2 className="mb-6 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400">Send Us a Message</h2>
            
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-teal-800">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  className="w-full px-4 py-3 text-teal-800 bg-white border border-teal-200 rounded-md bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="John Doe"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-teal-800">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  className="w-full px-4 py-3 text-teal-800 bg-white border border-teal-200 rounded-md bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="john@example.com"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block mb-2 text-sm font-medium text-teal-800">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  className="w-full px-4 py-3 text-teal-800 bg-white border border-teal-200 rounded-md bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="How can we help you?"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block mb-2 text-sm font-medium text-teal-800">Your Message</label>
                <textarea 
                  id="message" 
                  rows="5" 
                  className="w-full px-4 py-3 text-teal-800 bg-white border border-teal-200 rounded-md bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-pink-400" 
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="w-full px-6 py-4 text-white transition-all duration-300 rounded-md shadow-lg bg-gradient-to-r from-pink-500 to-pink-400 hover:from-pink-600 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-400"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        
        <div className="max-w-4xl mx-auto mt-20">
          <h2 className="p-2 mb-8 text-3xl font-bold text-center text-transparent bg-white rounded-lg bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400 bg-opacity-70">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="p-6 bg-white border border-teal-200 rounded-lg shadow-lg bg-opacity-90 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-teal-800">How secure are Vidula video conferences?</h3>
              <p className="text-teal-700">All Vidula video conferences are protected with end-to-end encryption, ensuring that your conversations remain private and secure. We also offer additional security features like meeting passwords and waiting rooms.</p>
            </div>
            
            <div className="p-6 bg-white border border-teal-200 rounded-lg shadow-lg bg-opacity-90 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-teal-800">How many participants can join a meeting?</h3>
              <p className="text-teal-700">Our standard plan supports up to 100 participants in a single meeting. For larger events, our premium plans can accommodate up to 500 participants with all the same great features.</p>
            </div>
            
            <div className="p-6 bg-white border border-teal-200 rounded-lg shadow-lg bg-opacity-90 backdrop-blur-sm">
              <h3 className="mb-2 text-xl font-semibold text-teal-800">Do I need to download any software to use Vidula?</h3>
              <p className="text-teal-700">No, Vidula is a web-based platform that works directly in your browser. There's no need to download or install any software. Just click the meeting link and you're good to go!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
