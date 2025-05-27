import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Settings() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    
    const storedUserData = localStorage.getItem('userData');
    
    if (!storedUserData) {
      navigate('/');
      return;
    }
    
    try {
      const parsedUserData = JSON.parse(storedUserData);
      setUserData(parsedUserData);
      setName(parsedUserData.name || '');
      setEmail(parsedUserData.email || '');
      setIsLoading(false);
    } catch (err) {
      setError('Error loading user data');
      setIsLoading(false);
    }
  }, [navigate]);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }

    if (!email.trim()) {
      setFormError('Email is required');
      return;
    }

    
    const updatedUserData = {
      ...userData,
      name,
      email
    };

    localStorage.setItem('userData', JSON.stringify(updatedUserData));
    setUserData(updatedUserData);
    setSuccessMessage('Profile updated successfully');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMessage('');

    if (!currentPassword) {
      setFormError('Current password is required');
      return;
    }

    if (!newPassword) {
      setFormError('New password is required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setFormError('New passwords do not match');
      return;
    }

    
    setSuccessMessage('Password updated successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-2 border-b-2 border-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <div className="text-xl text-red-500">{error}</div>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 mt-4 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto">
          <h1 className="mb-6 text-3xl font-bold text-gray-800">Account Settings</h1>
          
          {successMessage && (
            <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg">
              {successMessage}
            </div>
          )}
          
          {formError && (
            <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
              {formError}
            </div>
          )}
          
          {/* Profile Information */}
          <div className="mb-8 overflow-hidden bg-white shadow-md rounded-xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              <p className="text-sm text-gray-600">Update your account's profile information</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleProfileUpdate}>
                <div className="mb-4">
                  <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700">Name</label>
                  <input 
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className="px-5 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          
          <div className="overflow-hidden bg-white shadow-md rounded-xl">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Update Password</h2>
              <p className="text-sm text-gray-600">Ensure your account is using a secure password</p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label htmlFor="current-password" className="block mb-2 text-sm font-medium text-gray-700">Current Password</label>
                  <input 
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="new-password" className="block mb-2 text-sm font-medium text-gray-700">New Password</label>
                  <input 
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="confirm-password" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
                  <input 
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                
                <div>
                  <button 
                    type="submit"
                    className="px-5 py-2 text-white transition-colors bg-red-500 rounded-md hover:bg-red-600"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings; 