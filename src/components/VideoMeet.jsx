import React, { useEffect, useRef, useState } from 'react'
import io from "socket.io-client";
import { Badge, IconButton, TextField, Tooltip } from '@mui/material';
import { Button } from '@mui/material';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff'
import styles from "../styles/videoComponent.module.css";
import CallEndIcon from '@mui/icons-material/CallEnd'
import MicIcon from '@mui/icons-material/Mic'
import MicOffIcon from '@mui/icons-material/MicOff'
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import StopScreenShareIcon from '@mui/icons-material/StopScreenShare'
import ChatIcon from '@mui/icons-material/Chat'
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import server from '../environment';
import logoImage from '/logo.png';

const server_url = server;

var connections = {};

const peerConfigConnections = {
    "iceServers": [
        { "urls": "stun:stun.l.google.com:19302" },
        { "urls": "stun:stun1.l.google.com:19302" },
        { "urls": "stun:stun2.l.google.com:19302" }
    ]
}

export default function VideoMeetComponent({ roomId, isCreator, userName, onJoinRoom }) {

    var socketRef = useRef();
    let socketIdRef = useRef();

    let localVideoref = useRef();
    let creatorVideoRef = useRef();

    let [videoAvailable, setVideoAvailable] = useState(true);
    let [audioAvailable, setAudioAvailable] = useState(true);
    let [video, setVideo] = useState(true); 
    let [audio, setAudio] = useState(true); 
    let [screen, setScreen] = useState();
    let [screenAvailable, setScreenAvailable] = useState();
    let [messages, setMessages] = useState([])
    let [message, setMessage] = useState("");
    let [newMessages, setNewMessages] = useState(0);
    let [username, setUsername] = useState(userName || "");
    let [showParticipants, setShowParticipants] = useState(false);
    let [isBlinking, setIsBlinking] = useState(false);
    let [creatorConnected, setCreatorConnected] = useState(false);
    let [creatorStream, setCreatorStream] = useState(null);
    let [creatorId, setCreatorId] = useState(null);
    let [connectionEstablished, setConnectionEstablished] = useState(false);

    const videoRef = useRef([])
    let [videos, setVideos] = useState([])
    let [showChat, setShowChat] = useState(false);
    let [screenShare, setScreenShare] = useState(false);

    let [videoQuality, setVideoQuality] = useState('high'); // 'low', 'medium', 'high'
    let [videoConstraints, setVideoConstraints] = useState({ width: 1280, height: 720 });

    let [defaultVideoConstraints, setDefaultVideoConstraints] = useState({
        width: { ideal: 640, max: 1280 },
        height: { ideal: 480, max: 720 },
        frameRate: { ideal: 24, max: 30 }
    });

    useEffect(() => {
        console.log("VideoMeet component initialized with:", { roomId, isCreator, userName });
        
        
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            try {
                const userData = JSON.parse(userDataString);
                if (userData.username && !userName) {
                    setUsername(userData.username);
                }
            } catch (error) {
                console.error("Error parsing user data from localStorage:", error);
            }
        }
        
        getPermissions();
        
        
        setTimeout(() => {
            connectToSocketServer();
        }, 1500); 
    }, []);

    
    useEffect(() => {
        if (newMessages > 0 && !showChat) {
            const blinkInterval = setInterval(() => {
                setIsBlinking(prev => !prev);
            }, 500);
            
            return () => clearInterval(blinkInterval);
        } else {
            setIsBlinking(false);
        }
    }, [newMessages, showChat]);

    
    useEffect(() => {
        if (!isCreator && creatorStream && creatorVideoRef.current) {
            console.log("Setting creator's stream to video element");
            creatorVideoRef.current.srcObject = creatorStream;
            
            setCreatorConnected(true);
        }
    }, [creatorStream, isCreator]);

    
    useEffect(() => {
        if (!isCreator && socketRef.current && socketIdRef.current) {
            console.log("Participant requesting creator's stream");
            
            socketRef.current.emit('request-creator-connection', roomId, socketIdRef.current, username);
        }
    }, [isCreator, socketIdRef.current]);

    let getDislayMedia = () => {
        if (screen) {
            if (navigator.mediaDevices.getDisplayMedia) {
                navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                    .then(getDislayMediaSuccess)
                    .then((stream) => { })
                    .catch((e) => console.log(e))
            }
        }
    }

    const getPermissions = async () => {
        try {
            const videoPermission = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoPermission) {
                setVideoAvailable(true);
                console.log('Video permission granted');
            } else {
                setVideoAvailable(false);
                console.log('Video permission denied');
            }

            const audioPermission = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (audioPermission) {
                setAudioAvailable(true);
                console.log('Audio permission granted');
            } else {
                setAudioAvailable(false);
                console.log('Audio permission denied');
            }

            if (navigator.mediaDevices.getDisplayMedia) {
                setScreenAvailable(true);
            } else {
                setScreenAvailable(false);
            }

            if (videoAvailable || audioAvailable) {
                const userMediaStream = await navigator.mediaDevices.getUserMedia({ video: videoAvailable, audio: audioAvailable });
                if (userMediaStream) {
                    window.localStream = userMediaStream;
                    if (localVideoref.current) {
                        localVideoref.current.srcObject = userMediaStream;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (video !== undefined && audio !== undefined) {
            getUserMedia();
        }
    }, [video, audio])
    
    let getMedia = () => {
        setVideo(videoAvailable);
        setAudio(audioAvailable);

        getUserMedia();
        getScreenMedia();
    }

    let getUserMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log(e);
        }

        window.localStream = stream;

        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        if (screen && screen.getVideoTracks()[0]) {
            screen.getVideoTracks()[0].onended = function () {
                setScreen(null);
                setScreenShare(false);
                
                try {
                    let tracks = window.localStream.getTracks();
                    tracks.forEach(track => track.stop());
                } catch (e) {
                    console.log(e);
                }

                let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                window.localStream = blackSilence();
                if (localVideoref.current) {
                    localVideoref.current.srcObject = window.localStream;
                }

                getUserMedia();
            };
        }
    }

    let setVideoQualityLevel = (quality) => {
        let newConstraints;
        switch(quality) {
            case 'low':
                newConstraints = {
                    width: { ideal: 320, max: 480 },
                    height: { ideal: 240, max: 360 },
                    frameRate: { ideal: 15, max: 20 }
                };
                break;
            case 'medium':
                newConstraints = {
                    width: { ideal: 640, max: 854 },
                    height: { ideal: 480, max: 640 },
                    frameRate: { ideal: 20, max: 24 }
                };
                break;
            case 'high':
                newConstraints = {
                    width: { ideal: 1280, max: 1280 },
                    height: { ideal: 720, max: 720 },
                    frameRate: { ideal: 24, max: 30 }
                };
                break;
            case 'hd':
                newConstraints = {
                    width: { ideal: 1920, max: 1920 },
                    height: { ideal: 1080, max: 1080 },
                    frameRate: { ideal: 30, max: 30 }
                };
                break;
            default:
                newConstraints = {
                    width: { ideal: 640, max: 1280 },
                    height: { ideal: 480, max: 720 },
                    frameRate: { ideal: 24, max: 30 }
                };
        }
        setVideoConstraints(newConstraints);
        setVideoQuality(quality);
        
        
        if (video && videoAvailable) {
            getUserMedia();
        }
    };

    let getUserMedia = () => {
        if ((video && videoAvailable) || (audio && audioAvailable)) {
            const constraints = {
                video: video && videoAvailable ? videoConstraints : false,
                audio: audio && audioAvailable
            };
            
            console.log("Getting user media with constraints:", constraints);
            
            navigator.mediaDevices.getUserMedia(constraints)
                .then(getUserMediaSuccess)
                .then((stream) => {})
                .catch((e) => console.log(e))
        } else {
            try {
                let tracks = window.localStream.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) {}
        }
    }

    let getScreenMedia = () => {
        if (screen) {
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(getDislayMediaSuccess)
                .then((stream) => {})
                .catch((e) => {
                    console.log(e);
                    setScreen(false);
                    setScreenShare(false);
                });
        }
    }

    let getDislayMediaSuccess = (stream) => {
        try {
            window.localStream.getTracks().forEach((track) => track.stop());
        } catch (e) {
            console.log(e);
        }

        window.localStream = stream;
        
        if (localVideoref.current) {
            localVideoref.current.srcObject = stream;
        }

        if (screen && screen.getVideoTracks()[0]) {
            screen.getVideoTracks()[0].onended = function () {
                setScreen(null);
                setScreenShare(false);
                
                try {
                    let tracks = window.localStream.getTracks();
                    tracks.forEach(track => track.stop());
                } catch (e) {
                    console.log(e);
                }

                let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                window.localStream = blackSilence();
                if (localVideoref.current) {
                    localVideoref.current.srcObject = window.localStream;
                }

                getUserMedia();
            };
        }
    }

    let gotMessageFromServer = (fromId, message) => {
        var signal = JSON.parse(message);

        if (fromId !== socketIdRef.current) {
            if (signal.sdp) {
                connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
                    if (signal.sdp.type === 'offer') {
                        connections[fromId].createAnswer().then((description) => {
                            connections[fromId].setLocalDescription(description).then(() => {
                                socketRef.current.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
                            }).catch(e => console.log(e));
                        }).catch(e => console.log(e));
                    }
                }).catch(e => console.log(e));
            }

            if (signal.ice) {
                connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
            }
        }
    }

    let connectToSocketServer = () => {
        socketRef.current = io.connect(server_url, { secure: true });

        socketRef.current.on('signal', gotMessageFromServer);

        socketRef.current.on('connect', () => {
            console.log("Socket connected");
            socketIdRef.current = socketRef.current.id;

            
            socketRef.current.emit('join-room', roomId, socketIdRef.current, username);

            socketRef.current.on('creator-info', (creatorSocketId) => {
                console.log("Received creator info:", creatorSocketId);
                setCreatorId(creatorSocketId);
            });

            socketRef.current.on('end-meeting', () => {
                console.log("Meeting ended by creator");
                handleEndCall();
            });

           
            socketRef.current.on('receive-message', (message, senderId, senderName, isFromCreator) => {
                
                if (senderId !== socketIdRef.current) {
                    addMessage(message, senderName, senderId);
                }
            });

            
            socketRef.current.on('user-connected', (userId, userName) => {
                console.log("User connected:", userId, userName);
                
                
                if (isCreator && messages.length > 0) {
                    console.log("Sending message history to new user:", userId);
                    socketRef.current.emit('message-history', roomId, userId, messages);
                }
            });

            socketRef.current.on('message-history', (messageHistory) => {
                console.log("Received message history:", messageHistory);
                if (messageHistory && messageHistory.length > 0) {
                    setMessages(messageHistory);
                }
            });

            socketRef.current.on('user-left', (id) => {
                let videoToRemove = videos.find(video => video.socketId === id);
                if (videoToRemove) {
                    let newVideos = videos.filter(video => video.socketId !== id);
                    setVideos(newVideos);
                    
                    
                    if (!isCreator && videoToRemove.isCreator) {
                        setCreatorConnected(false);
                        setCreatorStream(null);
                        
                        handleEndCall();
                    }
                }
            });

            socketRef.current.on('user-joined', (id, clients, clientsData) => {
                console.log("User joined:", id, "Clients:", clients, "Client data:", clientsData);
                
                
                const creatorData = clientsData.find(client => client.isCreator);
                if (creatorData && !isCreator) {
                    console.log("Creator identified:", creatorData);
                    setCreatorId(creatorData.id);
                    
                    
                    socketRef.current.emit('request-creator-connection', roomId, socketIdRef.current, username);
                }
                
                clients.forEach((socketListId) => {
                    
                    if (connections[socketListId]) {
                        console.log("Connection already exists for", socketListId);
                        return;
                    }
                    
                    console.log("Creating new connection for", socketListId);
                    connections[socketListId] = new RTCPeerConnection(peerConfigConnections);
                    
                   
                    connections[socketListId].onicecandidate = function (event) {
                        if (event.candidate != null) {
                            socketRef.current.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
                        }
                    }

                    
                    connections[socketListId].onaddstream = (event) => {
                       
                        if (videos.some(video => video.socketId === socketListId)) {
                            console.log("Duplicate video prevented for", socketListId);
                            return;
                        }

                        
                        const userData = clientsData.find(client => client.id === socketListId) || {};
                        const isUserCreator = userData.isCreator || false;
                        const userName = userData.name || socketListId;

                        console.log("Adding video for", socketListId, "isCreator:", isUserCreator);

                       
                        let newVideo = {
                            id: socketListId,
                            socketId: socketListId,
                            name: userName,
                            stream: event.stream,
                            isCreator: isUserCreator
                        };

                        setVideos(oldVideos => [...oldVideos, newVideo]);

                        
                        if (isUserCreator && !isCreator) {
                            console.log("Setting creator's stream");
                            setCreatorConnected(true);
                            setCreatorStream(event.stream);
                            
                            
                            if (creatorVideoRef.current) {
                                creatorVideoRef.current.srcObject = event.stream;
                            }
                        }
                    }

                    
                    if (window.localStream !== undefined && window.localStream !== null) {
                        connections[socketListId].addStream(window.localStream);
                    } else {
                        let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
                        window.localStream = blackSilence();
                        connections[socketListId].addStream(window.localStream);
                    }
                });

                
                if (isCreator) {
                    socketRef.current.on('connect-to-participant', (participantId, participantName) => {
                        console.log(`Received request to connect to participant ${participantName} (${participantId})`);
                        
                        // If we already have a connection, ensure it's working properly
                        if (connections[participantId]) {
                            console.log("Connection already exists, checking if stream is flowing");
                            
                            
                            connections[participantId].createOffer().then((description) => {
                                connections[participantId].setLocalDescription(description)
                                    .then(() => {
                                        socketRef.current.emit('signal', participantId, JSON.stringify({ 'sdp': connections[participantId].localDescription }));
                                    })
                                    .catch(e => console.log(e));
                            }).catch(e => console.log(e));
                        }
                    });
                }

                if (id === socketIdRef.current) {
                    
                    setTimeout(() => {
                        clients.forEach((endpointId) => {
                            if (endpointId !== socketIdRef.current) {
                                console.log("Creating offer for", endpointId);
                                connections[endpointId].createOffer().then((description) => {
                                    connections[endpointId].setLocalDescription(description)
                                        .then(() => {
                                            socketRef.current.emit('signal', endpointId, JSON.stringify({ 'sdp': connections[endpointId].localDescription }));
                                        })
                                        .catch(e => console.log(e));
                                }).catch(e => console.log(e));
                            }
                        });
                    }, 1000);
                }
            });
        });
    }

    let silence = () => {
        let ctx = new AudioContext();
        let oscillator = ctx.createOscillator();
        let dst = oscillator.connect(ctx.createMediaStreamDestination());
        oscillator.start();
        ctx.resume();
        return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
    }

    let black = ({ width = 640, height = 480 } = {}) => {
        let canvas = Object.assign(document.createElement("canvas"), { width, height });
        canvas.getContext('2d').fillRect(0, 0, width, height);
        let stream = canvas.captureStream();
        return Object.assign(stream.getVideoTracks()[0], { enabled: false });
    }

    let handleVideo = async () => {
        const newVideoState = !video;
        console.log(`Toggling video from ${video} to ${newVideoState}`);
        
        
        setVideo(newVideoState);
        
        try {
            
            if (newVideoState) {
                console.log("Turning video ON - requesting new stream");
                
                
                try {
                    
                    const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    testStream.getTracks().forEach(track => track.stop()); // Clean up test stream
                    
                    setVideoAvailable(true);
                } catch (error) {
                    console.error("Camera not available:", error);
                    setVideoAvailable(false);
                    setVideo(false);
                    alert("Camera access is required to enable video. Please check your camera permissions.");
                    return;
                }
                
                if (videoAvailable) {
                    
                    const constraints = {
                        video: videoConstraints,
                        audio: audio && audioAvailable
                    };
                    
                    console.log("Requesting new media with constraints:", constraints);
                    
                    try {
                        
                        if (window.localStream) {
                            window.localStream.getVideoTracks().forEach(track => {
                                    track.stop();
                            });
                        }
                        
                        
                        const streamPromise = navigator.mediaDevices.getUserMedia(constraints);
                        const timeoutPromise = new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Stream request timeout')), 8000)
                        );
                        
                        
                        const stream = await Promise.race([streamPromise, timeoutPromise]);
                        
                        console.log("Got new stream with video enabled:", stream);
                        
                        if (!stream || !stream.getVideoTracks || stream.getVideoTracks().length === 0) {
                            throw new Error("No video track in stream");
                        }
                        
                        
                        const newStream = new MediaStream();
                        
                        
                        stream.getVideoTracks().forEach(track => {
                            track.enabled = true;
                            newStream.addTrack(track);
                        });
                        
                        
                        if (window.localStream) {
                            const audioTracks = window.localStream.getAudioTracks();
                            if (audioTracks.length > 0) {
                                audioTracks.forEach(track => {
                                    newStream.addTrack(track);
                                });
                            }
                        } else if (stream.getAudioTracks().length > 0) {
                            
                            stream.getAudioTracks().forEach(track => {
                                newStream.addTrack(track);
                            });
                        }
                        
                       
                        window.localStream = newStream;
                        
                        
                        if (localVideoref.current) {
                            localVideoref.current.srcObject = newStream;
                        }
                        
                        
                        Object.keys(connections).forEach(connectionId => {
                            const senders = connections[connectionId].getSenders();
                            const videoSender = senders.find(s => s.track && s.track.kind === 'video');
                            
                            if (videoSender) {
                                const videoTrack = newStream.getVideoTracks()[0];
                                if (videoTrack) {
                                    console.log("Replacing video track in connection", connectionId);
                                    videoSender.replaceTrack(videoTrack).catch(e => 
                                        console.error("Error replacing video track:", e)
                                    );
                                }
                            } else {
                               
                                const videoTrack = newStream.getVideoTracks()[0];
                                if (videoTrack) {
                                    console.log("Adding new video track to connection", connectionId);
                                    connections[connectionId].addTrack(videoTrack, newStream);
                                }
                            }
                        });
                    } catch (error) {
                        console.error("Error getting video stream:", error);
                        setVideo(false);  
                        
                        
                        if (error.name === "NotAllowedError") {
                            alert("Camera access denied. Please check your camera permissions in browser settings.");
                        } else if (error.name === "NotFoundError" || error.name === "NotReadableError") {
                            alert("Camera not found or is already in use by another application.");
                        } else if (error.message === "Stream request timeout") {
                            alert("Camera access timed out. Please try again.");
                        } else {
                            alert("Failed to start video. Please check your camera and try again.");
                        }
                    }
                } else {
                    setVideo(false);
                    alert("Camera is not available. Please check your device.");
                }
            } 
            
            else {
                console.log("Turning video OFF");
                if (window.localStream) {
                    const videoTracks = window.localStream.getVideoTracks();
                    videoTracks.forEach(track => {
                        track.enabled = false;
                        console.log(`Disabled video track: ${track.label}`);
                    });
                }
            }
        } catch (error) {
            console.error("Error in handleVideo:", error);
            
            setVideo(false);
            alert("An error occurred trying to access your camera. Please try again.");
        }
    }

    let handleAudio = () => {
        
        setAudio(!audio);
        
        
        if (window.localStream) {
            const audioTracks = window.localStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !audio;
                console.log(`Audio track ${track.label} is now ${!audio ? 'enabled' : 'disabled'}`);
            });
        }
        
        
        if (!audio && audioAvailable) {
            console.log("Restarting audio stream");
            getUserMedia();
        }
    }

    let handleScreen = () => {
        setScreen(!screen);
        setScreenShare(!screenShare);
        
        if (!screen) {
            navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
                .then(getDislayMediaSuccess)
                .catch((e) => {
                    console.log(e);
                    setScreen(false);
                    setScreenShare(false);
                });
        } else {
            try {
                let tracks = window.localStream.getTracks();
                tracks.forEach(track => track.stop());
            } catch (e) {}
            
            getUserMedia();
        }
    }

    let handleEndCall = () => {
        try {
            let tracks = window.localStream.getTracks();
            tracks.forEach(track => track.stop());
        } catch (e) {}

        if (socketRef.current) {
           
            if (isCreator) {
                socketRef.current.emit('end-meeting', roomId);
            }
            socketRef.current.disconnect();
        }

        window.location.href = "/";
    }

    let openChat = () => {
        setShowChat(true);
        setShowParticipants(false);
        setNewMessages(0);
    }

    let closeChat = () => {
        setShowChat(false);
    }

    let openParticipants = () => {
        setShowParticipants(true);
        setShowChat(false);
    }

    let closeParticipants = () => {
        setShowParticipants(false);
    }

    let handleMessage = (e) => {
        setMessage(e.target.value);
    }

    let addMessage = (data, sender, socketIdSender) => {
        setMessages(oldMessages => [...oldMessages, {
            sender: sender,
            data: data,
            socketId: socketIdSender,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);

        if (!showChat) {
            setNewMessages(prev => prev + 1);
        }
    }

    let sendMessage = () => {
        if (message.trim() !== "") {
            
            socketRef.current.emit('send-message', roomId, message, socketIdRef.current, username, isCreator);
            addMessage(message, username, socketIdRef.current);
            
            
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    fetch(`http://localhost:5001/api/meetings/${roomId}/messages`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            content: message,
                            isFromCreator: isCreator
                        })
                    })
                    .catch(err => console.error("Error saving message to database:", err));
                } catch (error) {
                    console.error("Error sending message to database:", error);
                }
            }
            
            setMessage("");
        }
    }

    return (
        <div className={styles.videoContainer}>
            <div className={styles.zoomLikeContainer}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <div className={styles.roomInfo}>
                            <span>Room ID: {roomId}</span>
                        </div>
                    </div>
                </div>
                
                <div className={styles.mainContent}>
                    <div className={styles.videoArea}>
                        <div className={`${styles.videoGrid} ${
                            videos.length === 0 
                                ? styles.single 
                                : videos.length === 1 
                                    ? styles.double 
                                    : videos.length <= 3 
                                        ? styles.quad 
                                        : styles.multi
                        }`}>
                            
                            {isCreator && (
                                <div className={styles.videoWrapper}>
                                    <video
                                        id="my-video"
                                        ref={localVideoref}
                                        autoPlay
                                        muted
                                        className={styles.myVideo}
                                    ></video>
                                    <div className={styles.videoOverlay}>
                                        {!video && <VideocamOffIcon className={styles.videoOffIndicator} />}
                                        {!audio && <MicOffIcon className={styles.audioOffIndicator} />}
                                    </div>
                                </div>
                            )}
                            
                            
                            {!isCreator && (
                                <div className={styles.videoWrapper}>
                                    {creatorConnected && creatorStream ? (
                                        <video
                                            id="creator-video"
                                            ref={creatorVideoRef}
                                            autoPlay
                                            className={styles.myVideo}
                                        ></video>
                                    ) : (
                                        <video
                                            id="my-video"
                                            ref={localVideoref}
                                            autoPlay
                                            muted
                                            className={styles.myVideo}
                                        ></video>
                                    )}
                                    <div className={styles.videoOverlay}>
                                        {(creatorConnected ? false : !video) && <VideocamOffIcon className={styles.videoOffIndicator} />}
                                        {(creatorConnected ? false : !audio) && <MicOffIcon className={styles.audioOffIndicator} />}
                                    </div>
                                </div>
                            )}
                            
                            
                            {videos.map((video, index) => (
                                <div key={index} className={styles.videoWrapper}>
                                    <video
                                        id={`peer-video-${video.id}`}
                                        ref={(element) => {
                                            if (element) {
                                                element.srcObject = video.stream;
                                                videoRef.current[index] = element;
                                            }
                                        }}
                                        autoPlay
                                        className={styles.myVideo}
                                    ></video>
                                    <div className={styles.videoOverlay}>
                                        <p>{video.name} {video.isCreator ? '(Creator)' : ''}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {showChat && (
                        <div className={styles.sidePanel}>
                            <div className={styles.panelHeader}>
                                <h3>Chat</h3>
                                <IconButton 
                                    onClick={closeChat} 
                                    size="small" 
                                    className={styles.closeButton}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                            <div className={styles.chatMessages}>
                                {messages.length > 0 ? (
                                    messages.map((msg, index) => (
                                        <div key={index} className={`${styles.message} ${msg.sender === username ? styles.myMessage : styles.otherMessage}`}>
                                            <div className={styles.messageHeader}>
                                                <span className={styles.messageSender}>{msg.sender}</span>
                                                <span className={styles.messageTime}>{msg.time}</span>
                                            </div>
                                            <div className={styles.messageContent}>{msg.data}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noMessages}>
                                        <p>No messages yet</p>
                                        <p className={styles.noMessagesHint}>Messages sent here are only seen by people in the call</p>
                                    </div>
                                )}
                            </div>
                            <div className={styles.chatInput}>
                                <TextField
                                    fullWidth
                                    variant="outlined"
                                    placeholder="Type message here..."
                                    value={message}
                                    onChange={handleMessage}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            sendMessage();
                                        }
                                    }}
                                    size="small"
                                    style={{ backgroundColor: "#2a2a2a", borderRadius: "4px" }}
                                    InputProps={{
                                        style: { color: "white" }
                                    }}
                                />
                                <Button 
                                    variant="contained" 
                                    onClick={sendMessage}
                                    disabled={!message.trim()}
                                    size="small"
                                    style={{ backgroundColor: "#0b57d0", color: "white" }}
                                >
                                    Send
                                </Button>
                            </div>
                        </div>
                    )}
                    
                    {showParticipants && (
                        <div className={styles.sidePanel}>
                            <div className={styles.panelHeader}>
                                <h3>Participants</h3>
                                <IconButton 
                                    onClick={closeParticipants} 
                                    size="small" 
                                    className={styles.closeButton}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </div>
                            <div className={styles.participantsList}>
                                <div className={styles.participant}>
                                    <div className={styles.participantInfo}>
                                        <span className={styles.participantName}>{username || 'You'} (You)</span>
                                        <span className={styles.participantHost}>{isCreator ? 'Host' : ''}</span>
                                    </div>
                                    <div className={styles.participantControls}>
                                        {!audio && <MicOffIcon fontSize="small" />}
                                        {!video && <VideocamOffIcon fontSize="small" />}
                                    </div>
                                </div>
                                
                                {videos.map((video, index) => (
                                    <div key={index} className={styles.participant}>
                                        <div className={styles.participantInfo}>
                                            <span className={styles.participantName}>{video.name}</span>
                                            <span className={styles.participantHost}>{video.isCreator ? 'Host' : ''}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                
                <div className={styles.controlBar}>
                    <div className={styles.controlGroup}>
                        <div className={styles.userInfo}>
                            <p>{username} {isCreator ? '(Creator)' : ''}</p>
                        </div>
                        <Tooltip title={audio ? "Mute" : "Unmute"}>
                            <div className={styles.controlWrapper}>
                                <IconButton 
                                    className={`${styles.controlButton} ${!audio ? styles.controlButtonOff : ''}`} 
                                    onClick={handleAudio}
                                >
                                    {audio ? <MicIcon /> : <MicOffIcon />}
                                </IconButton>
                                <span className={styles.controlLabel}>Mute</span>
                            </div>
                        </Tooltip>
                        
                        <Tooltip title={video ? "Stop Video" : "Start Video"}>
                            <div className={styles.controlWrapper}>
                                <IconButton 
                                    className={`${styles.controlButton} ${!video ? styles.controlButtonOff : ''}`} 
                                    onClick={handleVideo}
                                >
                                    {video ? <VideocamIcon /> : <VideocamOffIcon />}
                                </IconButton>
                                <span className={styles.controlLabel}>{video ? "Stop Video" : "Start Video"}</span>
                            </div>
                        </Tooltip>
                    </div>
                    
                    <div className={styles.controlGroup}>
                        <Tooltip title="Participants">
                            <div className={styles.controlWrapper}>
                                <IconButton 
                                    className={`${styles.controlButton} ${showParticipants ? styles.controlButtonActive : ''}`} 
                                    onClick={openParticipants}
                                >
                                    <PeopleIcon />
                                </IconButton>
                                <span className={styles.controlLabel}>Participants</span>
                            </div>
                        </Tooltip>
                        
                        <Tooltip title="Chat">
                            <div className={styles.controlWrapper}>
                                <IconButton 
                                    className={`${styles.controlButton} ${showChat ? styles.controlButtonActive : ''} ${isBlinking ? styles.blinking : ''}`} 
                                    onClick={openChat}
                                >
                                    {newMessages > 0 && !showChat ? (
                                        <Badge badgeContent={newMessages} color="error">
                                            <ChatIcon />
                                        </Badge>
                                    ) : (
                                        <ChatIcon />
                                    )}
                                </IconButton>
                                <span className={styles.controlLabel}>Chat</span>
                            </div>
                        </Tooltip>
                        
                        <Tooltip title="Share Screen">
                            <div className={styles.controlWrapper}>
                                <IconButton 
                                    className={`${styles.controlButton} ${screenShare ? styles.controlButtonActive : ''}`}
                                    onClick={handleScreen}
                                    disabled={!screenAvailable}
                                >
                                    {screenShare ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                                </IconButton>
                                <span className={styles.controlLabel}>Share</span>
                            </div>
                        </Tooltip>
                    </div>
                    
                    <div className={styles.controlGroup}>
                        <Tooltip title="Video Quality">
                            <div className={styles.controlWrapper}>
                                <select 
                                    value={videoQuality}
                                    onChange={(e) => setVideoQualityLevel(e.target.value)}
                                    className={styles.qualitySelect}
                                >
                                    <option value="low">Low (320p)</option>
                                    <option value="medium">Medium (480p)</option>
                                    <option value="high">High (720p)</option>
                                    <option value="hd">HD (1080p)</option>
                                </select>
                                <span className={styles.controlLabel}>Quality</span>
                            </div>
                        </Tooltip>
                    </div>
                    
                    <div className={styles.controlGroup}>
                        <div className={`${styles.controlWrapper} ${styles.endCallWrapper}`}>
                            <Button 
                                variant="contained" 
                                color="error" 
                                className={styles.endCallButton}
                                onClick={handleEndCall}
                                startIcon={<CallEndIcon />}
                            >
                                {isCreator ? 'End' : 'Leave'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
