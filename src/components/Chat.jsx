import React from 'react';
import { FaTimes } from 'react-icons/fa';


const Chat = ({ messages, sendMessage, currentUserId, onClose }) => {
  
  return (
    <table style={{ width: '100%', height: '100%', borderCollapse: 'collapse', backgroundColor: '#1a1a1a', color: 'white' }}>
      <thead>
        <tr>
          <th style={{ padding: '10px', borderBottom: '1px solid #333', textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Chat</span>
              <button 
                onClick={onClose}
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <FaTimes />
              </button>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ height: '100%', padding: '10px', verticalAlign: 'top' }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '50px', color: '#9ca3af' }}>
                <p>No messages yet</p>
                <p style={{ marginTop: '8px', fontSize: '14px' }}>
                  Messages sent here are only seen<br />by people in the call
                </p>
                <button 
                  onClick={() => sendMessage('Test message')}
                  style={{
                    marginTop: '20px',
                    padding: '8px 16px',
                    backgroundColor: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Send Test Message
                </button>
              </div>
            ) : (
              <div>
                {messages.map((msg) => (
                  <div 
                    key={msg.id} 
                    style={{
                      textAlign: msg.userId === currentUserId ? 'right' : 'left',
                      marginBottom: '10px'
                    }}
                  >
                    {msg.userId !== currentUserId && (
                      <div style={{ fontSize: '14px', marginBottom: '4px', color: '#d1d5db' }}>
                        {msg.userName}
                      </div>
                    )}
                    <div style={{
                      display: 'inline-block',
                      backgroundColor: msg.userId === currentUserId ? '#2563eb' : '#374151',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      maxWidth: '80%'
                    }}>
                      {msg.message}
                      <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.7 }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td style={{ padding: '10px', borderTop: '1px solid #333' }}>
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.messageInput;
                const message = input.value.trim();
                if (message) {
                  sendMessage(message);
                  input.value = '';
                }
              }}
              style={{ display: 'flex', gap: '8px' }}
            >
              <input
                name="messageInput"
                type="text"
                placeholder="Type a message..."
                style={{
                  flex: 1,
                  backgroundColor: '#374151',
                  color: 'white',
                  border: '1px solid #4b5563',
                  borderRadius: '4px',
                  padding: '8px 12px',
                  outline: 'none',
                  height: '40px'
                }}
              />
              <button 
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '8px 16px',
                  cursor: 'pointer'
                }}
              >
                Send
              </button>
            </form>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

export default Chat;
