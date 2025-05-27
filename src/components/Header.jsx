import { useState, useEffect } from 'react';
import { FaCopy } from 'react-icons/fa';

function Header({ roomId, participantsCount }) {
  const [isCopied, setIsCopied] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);
  
  
  const formattedTime = currentTime.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  
  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setIsCopied(true);
    
    
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-black border-b border-gray-800">
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <img src="/vidula-new-logo.svg" alt="Vidula Logo" className="w-6 h-6 mr-2" />
          <span className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-purple-500 to-blue-500">Vidula</span>
        </div>
        <div className="text-sm text-gray-400">{formattedTime}</div>
      </div>
      
      <div className="flex items-center">
        <div className="flex items-center mr-6">
          <div 
            className="flex items-center px-3 py-1 transition-colors rounded-md cursor-pointer bg-gray-800/70 backdrop-blur-sm hover:bg-gray-700"
            onClick={copyRoomId}
          >
            <span className="mr-2 text-sm font-medium text-white">Room ID: {roomId.substring(0, 8)}...</span>
            <FaCopy className={isCopied ? "text-red-500" : "text-gray-300"} />
          </div>
          {isCopied && (
            <span className="ml-2 text-xs text-red-400">Copied!</span>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="px-3 py-1 text-sm font-medium text-white rounded-full bg-red-600/80 backdrop-blur-sm">
            {participantsCount} {participantsCount === 1 ? 'participant' : 'participants'}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
