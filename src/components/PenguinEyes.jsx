import React from 'react';

const PenguinEyes = ({ eyesClosed }) => {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      
      <ellipse cx="60" cy="70" rx="35" ry="45" fill="#222831" />
      
      
      <ellipse cx="60" cy="75" rx="25" ry="35" fill="#EEEEEE" />
      
      
      <circle cx="60" cy="40" r="25" fill="#222831" />
      
      {}
      <circle cx="48" cy="35" r="5" fill="white" />
      <circle cx="72" cy="35" r="5" fill="white" />
      <circle cx="48" cy="35" r="2.5" fill="#222831" />
      <circle cx="72" cy="35" r="2.5" fill="#222831" />
      
      
      <path d="M55,45 L65,45 L60,55 Z" fill="#FF9800" />
      
      
      <path d="M50,115 L45,105 L55,105 Z" fill="#FF9800" />
      <path d="M70,115 L65,105 L75,105 Z" fill="#FF9800" />
      
      
      {!eyesClosed ? (
        
        <>
          <path d="M25,60 Q35,70 30,90" fill="#222831" />
          <path d="M95,60 Q85,70 90,90" fill="#222831" />
        </>
      ) : (
        
        <>
          
          <circle cx="48" cy="35" r="5" fill="#222831" />
          <circle cx="72" cy="35" r="5" fill="#222831" />
          
          
          <g className="left-flipper">
            <ellipse cx="48" cy="35" rx="12" ry="10" fill="#222831" />
            <path d="M48,35 C 35,20 25,30 30,45" fill="#222831" stroke="#222831" strokeWidth="1" />
          </g>
          
          
          <g className="right-flipper">
            <ellipse cx="72" cy="35" rx="12" ry="10" fill="#222831" />
            <path d="M72,35 C 85,20 95,30 90,45" fill="#222831" stroke="#222831" strokeWidth="1" />
          </g>
          
         
          <circle cx="48" cy="42" r="4" fill="#FF9999" opacity="0.6" />
          <circle cx="72" cy="42" r="4" fill="#FF9999" opacity="0.6" />
        </>
      )}
      
      
      <style>{`
        .penguin-svg .left-flipper,
        .penguin-svg .right-flipper {
          animation: coverEyes 0.3s ease-out forwards;
        }
        
        @keyframes coverEyes {
          0% { transform: translateY(20px); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </svg>
  );
};

export default PenguinEyes;
