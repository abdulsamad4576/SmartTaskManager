import React, { useState, useEffect } from 'react';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../styles/App.css';

export default function RegisterForm({ onRegister, error, onClearError }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // Clear any existing error when component mounts
  useEffect(() => {
    if (onClearError) {
      onClearError();
    }
  }, []);
  
  const handleSubmit = e => {
    e.preventDefault();
    if (password !== confirm) return;
    onRegister({ username, password });
  };

  const passwordsMatch = password === confirm;
  const canSubmit = username && password && confirm && passwordsMatch;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join Smart Task Manager</p>

        {error && (
          <div style={{ color: '#d32f2f', marginBottom: '20px', padding: '10px', background: '#ffebee', borderRadius: '8px', border: '1px solid #ffcdd2' }}>
            {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-input">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
            <PersonIcon className="auth-input-icon" />
          </div>
          
          <div className="auth-input">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <LockIcon className="auth-input-icon" />
          </div>
          
          <div className="auth-input">
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              style={confirm && !passwordsMatch ? { borderColor: '#d32f2f' } : {}}
            />
            <LockIcon className="auth-input-icon" />
          </div>
          
          {confirm && !passwordsMatch && (
            <div style={{ color: '#d32f2f', fontSize: '14px', marginTop: '-10px' }}>
              Passwords do not match
            </div>
          )}
          
          <button type="submit" className="auth-button" disabled={!canSubmit}>
            Create Account
          </button>
        </form>

        <div className="auth-switch">
          <span>Already have an account? </span>
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'underline', fontWeight: '500' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 