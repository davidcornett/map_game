import React from "react";

export default function LoadingOverlay({ show, message = "Building your country…" }) {
  if (!show) return null;

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.55)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  };

  const cardStyle = {
    background: 'rgb(20, 22, 28)',
    color: '#fff',
    borderRadius: '12px',
    padding: '24px 28px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: '280px'
  };

  const textStyle = { fontSize: 16, lineHeight: 1.3, opacity: 0.95 };

  return (
    <div style={overlayStyle} aria-live="polite" aria-busy="true">
      <div style={cardStyle}>
        <svg width="36" height="36" viewBox="0 0 50 50" role="img" aria-label="Loading">
          <circle cx="25" cy="25" r="20" fill="none" stroke="#3ecf8e" strokeWidth="5" opacity="0.15"/>
          <circle cx="25" cy="25" r="20" fill="none" stroke="#3ecf8e" strokeWidth="5" strokeLinecap="round"
                  strokeDasharray="31.4 125.6">
            <animateTransform attributeName="transform" type="rotate"
                              from="0 25 25" to="360 25 25"
                              dur="0.9s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div style={textStyle}>{message}</div>
      </div>
    </div>
  );
}