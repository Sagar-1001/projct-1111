import { useEffect, useRef, useState } from 'react';

const VideoGrid = ({ peers, myStream, myVideoRef, userName, myPeerId, participants, isRoomCreator }) => {
  
  const peerVideoRefs = useRef({});
  const [activeView, setActiveView] = useState('gallery'); 
  const totalParticipants = Object.keys(peers).length + 1; 
  
  
  useEffect(() => {
    console.log("VideoGrid - isRoomCreator:", isRoomCreator);
    console.log("VideoGrid - participants:", participants);
    console.log("VideoGrid - myPeerId:", myPeerId);
    console.log("VideoGrid - peers:", Object.keys(peers));
  }, [isRoomCreator, participants, myPeerId, peers]);
  
  useEffect(() => {
    Object.entries(peers).forEach(([peerId, stream]) => {
      if (peerVideoRefs.current[peerId] && peerVideoRefs.current[peerId].srcObject !== stream) {
        peerVideoRefs.current[peerId].srcObject = stream;
      }
    });
  }, [peers]);

  
  const isOneOnOne = totalParticipants === 2;
  
  
  useEffect(() => {
    console.log("Found creator ID:", Object.keys(participants).find(id => participants[id]?.isCreator));
    console.log("All participants:", participants);
    console.log("All peers:", peers);
  }, [participants, peers]);
  
  return (
    <div className="relative flex-1 overflow-hidden bg-black">
      <div className={`video-grid ${totalParticipants <= 1 ? 'single-video' : totalParticipants <= 4 ? 'grid-2x2' : 'grid-3x3'}`}>
       
        {}
        <div className={`video-container ${isOneOnOne ? 'self-video-small' : ''}`}>
          <video
            ref={myVideoRef}
            muted
            autoPlay
            playsInline
            className={`video-element ${isOneOnOne ? 'self-video-pip' : ''}`}
          />
          <div className="video-overlay">
            <div className="participant-name">
              {userName} (You) {isRoomCreator ? '(Creator)' : ''}
              {participants[myPeerId]?.isScreenSharing && ' (Screen)'}
            </div>
          </div>
        </div>
        
        {}
        {Object.entries(peers).map(([peerId, stream]) => (
          <div key={peerId} className={`video-container ${isOneOnOne ? 'other-video-large' : ''}`}>
            <video
              ref={element => {
                if (element) {
                  peerVideoRefs.current[peerId] = element;
                  element.srcObject = stream;
                }
              }}
              autoPlay
              playsInline
              className={`video-element ${isOneOnOne ? 'other-video-main' : ''}`}
            />
            <div className="video-overlay">
              <div className="participant-name">
                {participants[peerId]?.name || 'Participant'} 
                {participants[peerId]?.isCreator ? ' (Creator)' : ''}
                {participants[peerId]?.isScreenSharing && ' (Screen)'}
              </div>
            </div>
          </div>
        ))}
        
        {}
        {!isRoomCreator && Object.keys(peers).length === 0 && (
          <div className="video-container creator-placeholder">
            <div className="creator-avatar">
              <div className="avatar-circle">
                <span className="avatar-text">C</span>
              </div>
            </div>
            <div className="video-overlay">
              <div className="participant-name">
                Meeting Creator
                <span className="camera-off-indicator"> (Camera Off)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoGrid;
