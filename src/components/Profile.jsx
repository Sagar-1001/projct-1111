import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    meetingsAttended: 0,
    meetingsCreated: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    
    if (!storedUserData) {
      navigate('/');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      
      // In a real application, we would fetch additional data from the server
      // For now, we'll use the data from localStorage + some mock data
      setUserData({
        name: parsedUserData.name || 'User',
        email: parsedUserData.email || 'user@example.com',
        joinDate: parsedUserData.joinDate || new Date().toLocaleDateString(),
        meetingsAttended: 12, // Mock data
        meetingsCreated: 5    // Mock data
      });
      setIsLoading(false);
    } catch (err) {
      setError('Error loading profile data');
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-red-500 text-xl">{error}</div>
        <button 
          onClick={() => navigate('/')} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {/* Header with user info */}
          <div className="p-8 bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 text-white">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-red-500 mb-4 md:mb-0 md:mr-6">
                {userData.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold">{userData.name}</h1>
                <p className="text-white/80">{userData.email}</p>
                <p className="text-white/60 text-sm mt-1">Member since: {userData.joinDate}</p>
              </div>
            </div>
          </div>
          
          {/* User stats */}
          <div className="p-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Activity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="text-4xl font-bold text-red-500 mb-2">{userData.meetingsCreated}</div>
                <div className="text-gray-600">Meetings Created</div>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="text-4xl font-bold text-blue-500 mb-2">{userData.meetingsAttended}</div>
                <div className="text-gray-600">Meetings Attended</div>
              </div>
            </div>
            
            {/* Account settings preview */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Settings</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium text-gray-800">Change Password</h3>
                    <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                  </div>
                  <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                    Update
                  </button>
                </div>
              </div>
            </div>
            
            {/* Recent activity preview */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Meetings</h2>
              
              <div className="border rounded-lg overflow-hidden">
                <div className="divide-y">
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Weekly Team Standup</h3>
                      <p className="text-sm text-gray-500">Yesterday at 9:00 AM</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Hosted</span>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Product Review</h3>
                      <p className="text-sm text-gray-500">July 15, 2023 at 2:30 PM</p>
                    </div>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Joined</span>
                  </div>
                  
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800">Client Presentation</h3>
                      <p className="text-sm text-gray-500">July 10, 2023 at 11:00 AM</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Hosted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 