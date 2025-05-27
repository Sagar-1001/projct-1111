


io.on('connection', (socket) => {
    

    
    socket.on('message-history', (roomId, targetUserId, messages) => {
        console.log(`User ${socket.id} sending message history to ${targetUserId} in room ${roomId}`);
        
        io.to(targetUserId).emit('message-history', messages);
    });

    
}); 