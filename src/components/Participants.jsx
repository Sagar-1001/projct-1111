import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash, FaDesktop } from 'react-icons/fa';

const Participants = ({ participants, currentUserId }) => {
  
  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="participants-panel w-64">
      <div className="p-3 border-b border-gray-200 font-medium">
        Participants ({Object.keys(participants).length})
      </div>
      
      <div className="mt-2">
        {Object.entries(participants).map(([id, participant]) => (
          <div key={id} className="participant-item">
            <div className="participant-avatar">
              {getInitials(participant.name || 'User')}
            </div>
            
            <div className="participant-info">
              <div className="participant-name">
                {participant.name} {id === currentUserId && '(You)'}
              </div>
              <div className="participant-status">
                {participant.isScreenSharing && 'Sharing screen'}
              </div>
            </div>
            
            <div className="flex gap-1">
              {participant.audioEnabled === false && (
                <FaMicrophoneSlash className="text-gray-500" title="Muted" />
              )}
              {participant.videoEnabled === false && (
                <FaVideoSlash className="text-gray-500" title="Video off" />
              )}
              {participant.isScreenSharing && (
                <FaDesktop className="text-primary-color" title="Sharing screen" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;
