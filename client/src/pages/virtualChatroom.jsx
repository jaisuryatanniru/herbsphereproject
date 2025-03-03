import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Daily from '@daily-co/daily-js';

const VideoCall = () => {
  const callFrameRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize Daily.co call frame
    callFrameRef.current = Daily.createFrame({
      url: 'https://herbsphere.daily.co/sJTJKK5Vl29vckq3hKjF', // Replace with your room URL
      showLeaveButton: true,
      iframeStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '85%',
        border: 0,
        zIndex: 999,
      },
    });

    // Join the call
    callFrameRef.current.join();

    // Clean up on unmount
    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.leave().then(() => {
          callFrameRef.current.destroy();
        });
      }
    };
  }, []);

  const handleBack = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave().then(() => {
        callFrameRef.current.destroy();
        navigate(-1); // Go back to the previous page (consultation form)
      }).catch(() => {
        callFrameRef.current.destroy();
        navigate(-1);
      });
    } else {
      navigate(-1);
    }
  };

  return (
    <div>
      {/* Leave Session Button at Top-Right Corner */}
      <button
        onClick={handleBack}
        style={{
          position: 'fixed',
          top: '10px', // Positions the button at the top
          right: '10px', // Positions the button at the right
          zIndex: 1001,
          backgroundColor: '#0066C3',
          color: '#FFF',
          padding: '8px 40px',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Leave Session
      </button>

      {/* Page Title */}
      <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Video Call with Ayurvedic Professional</h1>
    </div>
  );
};

export default VideoCall;