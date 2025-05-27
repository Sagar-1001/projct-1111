import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  meetingId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  settings: {
    allowChat: {
      type: Boolean,
      default: true
    },
    allowScreenShare: {
      type: Boolean,
      default: true
    },
    muteParticipantsOnEntry: {
      type: Boolean,
      default: false
    }
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    senderName: String,
    content: String,
    isFromCreator: Boolean,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

const Meeting = mongoose.model('Meeting', meetingSchema);

export default Meeting;
