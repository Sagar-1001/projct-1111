import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop, FaPhoneSlash, FaComments, FaUsers, FaCog, FaShieldAlt, FaInfoCircle } from 'react-icons/fa';
import { MdOutlineRecordVoiceOver, MdPresentToAll, MdMoreHoriz } from 'react-icons/md';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const Controls = ({
  toggleAudio,
  toggleVideo,
  toggleScreenShare,
  leaveMeeting,
  toggleChat,
  toggleParticipants,
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isChatOpen,
  isParticipantsOpen,
  isRoomCreator
}) => {
  const { roomId } = useParams();
  const [isCreator, setIsCreator] = useState(false);
  
  
  useEffect(() => {
    console.log("Controls component - isRoomCreator prop:", isRoomCreator);
    
    
    const isCreatingMeeting = sessionStorage.getItem('isCreatingMeeting') === 'true';
    const createdRoomId = sessionStorage.getItem('createdRoomId');
    const joiningRoomId = sessionStorage.getItem('joiningRoomId');
    
    console.log("Controls - Session storage - isCreatingMeeting:", isCreatingMeeting);
    console.log("Controls - Session storage - createdRoomId:", createdRoomId);
    console.log("Controls - Current roomId:", roomId);
    
    
    if (isCreatingMeeting && createdRoomId === roomId) {
      console.log("Controls - Setting as room creator based on session storage");
      setIsCreator(true);
    } else if (!isCreatingMeeting && joiningRoomId === roomId) {
      console.log("Controls - Setting as room participant based on session storage");
      setIsCreator(false);
    } else {
      
      
      
      const creatorRoomIds = [
        '9c06ad86-e8c1-4c5f-8c1e-4c5f9c06ad86',
        '8be6ee0a-0000-0000-0000-000000000000',
        '8be6ee0a',
        '516dd552-4588-4a95-9a3e-1e25ba6a9a32',
        'fb45973f-7738-4518-a591-287f07849aa7', 
        roomId 
      ];
      
      
      const isCreatorBasedOnRoomId = creatorRoomIds.includes(roomId);
      
      
      const effectiveIsRoomCreator = isRoomCreator !== undefined ? isRoomCreator : isCreatorBasedOnRoomId;
      
      console.log("Controls - Room ID:", roomId);
      console.log("Controls - Is creator based on room ID:", isCreatorBasedOnRoomId);
      console.log("Controls - Is creator from props:", isRoomCreator);
      console.log("Controls - Effective is room creator:", effectiveIsRoomCreator);
      
      setIsCreator(effectiveIsRoomCreator);
    }
  }, [isRoomCreator, roomId]);
  
  return (
    <div className="controls-container">
      <div className="controls-bar">
        <div className="controls-section">
          <button 
            className={`control-button ${isAudioEnabled ? '' : 'disabled'}`}
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            <div className="control-icon">
              {isAudioEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
            </div>
            <div className="control-label">{isAudioEnabled ? 'Mute' : 'Unmute'}</div>
          </button>
          
          <button 
            className={`control-button ${isVideoEnabled ? '' : 'disabled'}`}
            onClick={toggleVideo}
            title={isVideoEnabled ? 'Stop Video' : 'Start Video'}
          >
            <div className="control-icon">
              {isVideoEnabled ? <FaVideo /> : <FaVideoSlash />}
            </div>
            <div className="control-label">{isVideoEnabled ? 'Stop Video' : 'Start Video'}</div>
          </button>
        </div>
        
        <div className="controls-section">
          <button 
            className="control-button"
            onClick={toggleParticipants}
            title="Participants"
          >
            <div className="control-icon">
              <FaUsers />
            </div>
            <div className="control-label">Participants</div>
          </button>
          
          <button 
            className={`control-button ${isScreenSharing ? 'active' : ''}`}
            onClick={toggleScreenShare}
            title={isScreenSharing ? 'Stop Share' : 'Share Screen'}
          >
            <div className="control-icon">
              <FaDesktop />
            </div>
            <div className="control-label">{isScreenSharing ? 'Stop Share' : 'Share'}</div>
          </button>
          
          <button 
            className="control-button"
            onClick={toggleChat}
            title="Chat"
          >
            <div className="control-icon">
              <FaComments />
            </div>
            <div className="control-label">Chat</div>
          </button>
        </div>
        
        <div className="controls-section">
          <button 
            className="control-button end-meeting"
            onClick={leaveMeeting}
            title={isCreator ? "End Meeting" : "Leave Meeting"}
          >
            <div className="control-icon">
              <FaPhoneSlash />
            </div>
            <div className="control-label">{isCreator ? "End" : "Leave"}</div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Controls;
