import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : '*',
    methods: ['GET', 'POST']
  }
});


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


connectDB()
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => console.log('MongoDB connection error:', err));


app.use('/api/users', userRoutes);
app.use('/api/meetings', meetingRoutes);


const rooms = {};
const roomCreators = {}; 


io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  
  socket.on('message-history', (roomId, targetUserId, messages) => {
    console.log(`User ${socket.id} sending message history to ${targetUserId} in room ${roomId}`);
    
    io.to(targetUserId).emit('message-history', messages);
  });

  
  socket.on('join-room', (roomId, userId, userName) => {
    console.log(`User ${userName} (${userId}) joining room ${roomId}`);
    
    
    socket.join(roomId);
    
    
    let isCreator = false;
    if (!rooms[roomId]) {
      rooms[roomId] = { participants: {} };
      
      roomCreators[roomId] = userId;
      isCreator = true;
      console.log(`User ${userName} (${userId}) created room ${roomId}`);
    } else {
      isCreator = roomCreators[roomId] === userId;
    }
    
    
    rooms[roomId].participants[userId] = {
      id: userId,
      name: userName,
      socketId: socket.id,
      isCreator: isCreator
    };
    
    
    console.log(`Sending room creator status to ${userName} (${userId}): ${isCreator}`);
    socket.emit('room-creator-status', isCreator);
    
    
    socket.on('check-creator-status', (checkRoomId, checkUserId) => {
      if (roomCreators[checkRoomId] === checkUserId) {
        console.log(`User ${checkUserId} is the creator of room ${checkRoomId}`);
        socket.emit('room-creator-status', true);
      } else {
        console.log(`User ${checkUserId} is NOT the creator of room ${checkRoomId}`);
        socket.emit('room-creator-status', false);
      }
    });
    
    
    socket.to(roomId).emit('user-connected', userId, userName);
    
    
    socket.emit('room-participants', rooms[roomId].participants);
    
    
    io.to(roomId).emit('room-participants-updated', rooms[roomId].participants);
    
    
    if (!isCreator && roomCreators[roomId]) {
      const creatorId = roomCreators[roomId];
      const creatorSocketId = rooms[roomId].participants[creatorId]?.socketId;
      
      if (creatorSocketId) {
        console.log(`Notifying creator ${creatorId} that participant ${userId} has joined`);
        io.to(creatorSocketId).emit('participant-joined', userId, userName);
      }
    }
    
    
    socket.on('disconnect', () => {
      console.log(`User ${userName} (${userId}) disconnected from room ${roomId}`);
      
     
      if (rooms[roomId] && rooms[roomId].participants[userId]) {
        delete rooms[roomId].participants[userId];
        
        
        socket.to(roomId).emit('user-disconnected', userId);
        
        
        io.to(roomId).emit('room-participants-updated', rooms[roomId].participants);
        
       
        if (Object.keys(rooms[roomId].participants).length === 0) {
          delete rooms[roomId];
          delete roomCreators[roomId];
          console.log(`Room ${roomId} removed as it's empty`);
        }
      }
    });
  });

  
  socket.on('request-creator-connection', (roomId, userId, userName) => {
    console.log(`User ${userName} (${userId}) requesting direct connection to creator of room ${roomId}`);
    
    if (rooms[roomId] && roomCreators[roomId]) {
      const creatorId = roomCreators[roomId];
      const creatorSocketId = rooms[roomId].participants[creatorId]?.socketId;
      
      if (creatorSocketId) {
        console.log(`Notifying creator ${creatorId} to connect to participant ${userId}`);
        io.to(creatorSocketId).emit('connect-to-participant', userId, userName);
      } else {
        console.log(`Creator socket ID not found for room ${roomId}`);
      }
    } else {
      console.log(`Room ${roomId} or its creator not found`);
    }
  });

 
  socket.on('send-message', (roomId, message, userId, userName, isFromCreator) => {
    console.log(`Message from ${userName} (${userId}) in room ${roomId}: ${message} | Creator: ${isFromCreator}`);
    
   
    io.to(roomId).emit('receive-message', message, userId, userName, isFromCreator);
    
    
    try {
      import('../models/meeting-model.js').then(({ default: Meeting }) => {
        Meeting.findOne({ meetingId: roomId })
          .then(meeting => {
            if (meeting) {
              meeting.messages.push({
                sender: userId,
                senderName: userName,
                content: message,
                isFromCreator: isFromCreator
              });
              meeting.save();
            }
          })
          .catch(err => console.error("Error saving message:", err));
      }).catch(err => console.error("Error importing Meeting model:", err));
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

 
  socket.on('toggle-video', (roomId, userId, videoEnabled) => {
    socket.to(roomId).emit('user-toggle-video', userId, videoEnabled);
  });

  socket.on('toggle-audio', (roomId, userId, audioEnabled) => {
    socket.to(roomId).emit('user-toggle-audio', userId, audioEnabled);
  });

  
  socket.on('start-screen-share', (roomId, userId) => {
    socket.to(roomId).emit('user-screen-share', userId, true);
  });

  socket.on('stop-screen-share', (roomId, userId) => {
    socket.to(roomId).emit('user-screen-share', userId, false);
  });
  
  
  socket.on('signal', (toId, message) => {
    io.to(toId).emit('signal', socket.id, message);
  });
});


if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}


const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
