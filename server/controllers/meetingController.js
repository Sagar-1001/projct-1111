import Meeting from '../models/meeting-model.js';
import User from '../models/user-model.js';
import { v4 as uuidv4 } from 'uuid';


export const createMeeting = async (req, res) => {
  try {
    const { title, description, settings } = req.body;
    const userId = req.user._id;
    
    
    const meetingId = uuidv4();
    
    
    const newMeeting = new Meeting({
      meetingId,
      title,
      description,
      creator: userId,
      settings: settings || {},
      participants: [{
        userId,
        username: req.user.username,
      }]
    });
    
    
    await newMeeting.save();
    
    await User.findByIdAndUpdate(
      userId,
      { $push: { meetings: newMeeting._id } }
    );
    
    return res.status(201).json({
      message: "Meeting created successfully",
      meeting: {
        _id: newMeeting._id,
        meetingId: newMeeting.meetingId,
        title: newMeeting.title,
        description: newMeeting.description,
        startTime: newMeeting.startTime,
        settings: newMeeting.settings
      }
    });
  } catch (error) {
    console.error("Create meeting error:", error);
    return res.status(500).json({ message: "Server error creating meeting" });
  }
};


export const getMeetingDetails = async (req, res) => {
  try {
    const { meetingId } = req.params;
    
    
    const meeting = await Meeting.findOne({ meetingId })
      .populate('creator', 'username email')
      .populate('participants.userId', 'username email');
    
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    
    return res.status(200).json({ meeting });
  } catch (error) {
    console.error("Get meeting error:", error);
    return res.status(500).json({ message: "Server error retrieving meeting" });
  }
};


export const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;
    
    
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    
    
    if (!meeting.isActive) {
      return res.status(400).json({ message: "Meeting has ended" });
    }
    
    
    const isParticipant = meeting.participants.some(
      p => p.userId && p.userId.toString() === userId.toString()
    );
    
    
    if (!isParticipant) {
      meeting.participants.push({
        userId,
        username: req.user.username
      });
      
      await meeting.save();
    }
    
    
    const isCreator = meeting.creator.toString() === userId.toString();
    
    return res.status(200).json({
      message: "Joined meeting successfully",
      meeting: {
        _id: meeting._id,
        meetingId: meeting.meetingId,
        title: meeting.title,
        isCreator,
        settings: meeting.settings
      }
    });
  } catch (error) {
    console.error("Join meeting error:", error);
    return res.status(500).json({ message: "Server error joining meeting" });
  }
};


export const endMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const userId = req.user._id;
    
   
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    
    
    if (meeting.creator.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only the meeting creator can end the meeting" });
    }
    
    
    meeting.isActive = false;
    meeting.endTime = new Date();
    await meeting.save();
    
    return res.status(200).json({ message: "Meeting ended successfully" });
  } catch (error) {
    console.error("End meeting error:", error);
    return res.status(500).json({ message: "Server error ending meeting" });
  }
};


export const getUserMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    
    
    const meetings = await Meeting.find({
      $or: [
        { creator: userId },
        { 'participants.userId': userId }
      ]
    }).sort({ startTime: -1 });
    
    return res.status(200).json({ meetings });
  } catch (error) {
    console.error("Get user meetings error:", error);
    return res.status(500).json({ message: "Server error retrieving meetings" });
  }
};


export const saveChatMessage = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { content } = req.body;
    const userId = req.user._id;
    
   
    const meeting = await Meeting.findOne({ meetingId });
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    
    
    const isParticipant = meeting.participants.some(
      p => p.userId && p.userId.toString() === userId.toString()
    );
    
    if (!isParticipant) {
      return res.status(403).json({ message: "You are not a participant in this meeting" });
    }
    
    
    const isFromCreator = meeting.creator.toString() === userId.toString();
    
    
    meeting.messages.push({
      sender: userId,
      senderName: req.user.username,
      content,
      isFromCreator
    });
    
    await meeting.save();
    
    return res.status(201).json({ message: "Message saved successfully" });
  } catch (error) {
    console.error("Save message error:", error);
    return res.status(500).json({ message: "Server error saving message" });
  }
};
