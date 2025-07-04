import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const boxStyle = {
  background: '#fff',
  padding: 32,
  borderRadius: 12,
  boxShadow: '0 2px 16px #888',
  minWidth: 320,
  textAlign: 'center',
};

export default function ReminderModal({ task, onClose }) {
  if (!task) return null;
  return (
    <div style={modalStyle}>
      <div style={boxStyle}>
        <h2>Task Reminder</h2>
        <p><b>{task.title}</b></p>
        <p>Due at: {new Date(task.deadline).toLocaleString()}</p>
        <button onClick={onClose} style={{ marginTop: 16 }}>Close</button>
      </div>
    </div>
  );
} 