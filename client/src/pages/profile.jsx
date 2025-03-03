import React, { useState, useEffect } from 'react';
import { FaUserCircle, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './profile.css';

const Profile = () => {
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('https://herbsphereproject-3.onrender.com/api/userinfo', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user info:', error);
      } finally {
        setLoading(false); // Set loading to false once the fetch completes
      }
    };

    fetchUser();
  }, []);

  const handleShowPasswordFields = () => {
    setShowPasswordFields(true);
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      const response = await axios.post('https://herbsphereproject-3.onrender.com/api/change-password', {
        oldPassword,
        newPassword
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data === "Password updated successfully") {
        alert('Password updated successfully!');
        setShowPasswordFields(false);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert('Incorrect old password!');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      alert('An error occurred while updating the password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="profile-page-container">
      <div className="profile-card">
        <FaTimes className="close-icon" onClick={() => navigate(-1)} />
        <div className="profile-icon-container">
          <FaUserCircle className="profile-icon" size={100} />
        </div>
        <div className="profile-info">
          {loading ? (
            <p>Loading user info...</p> // Loading spinner could be added here
          ) : user ? (
            <>
              <p><strong>{user.name}</strong></p>
              <p>{user.email}</p>
            </>
          ) : (
            <p>Error loading user info!</p> // Error handling if user data is null
          )}
        </div>
        <div className="profile-actions">
          {showPasswordFields ? (
            <>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button className="profile-action-btn" onClick={handlePasswordChange}>
                Change Password
              </button>
            </>
          ) : (
            <button className="profile-action-btn" onClick={handleShowPasswordFields}>
              Change Password
            </button>
          )}
          <button className="profile-action-btn logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
