import React, { useState } from 'react';
import { Person as PersonIcon, Lock as LockIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../styles/App.css';

export default function LoginForm({ onLogin, error }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = e => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your account</p>

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
          
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>

        <div className="auth-switch">
          <span>Don't have an account? </span>
          <Link to="/register" style={{ color: '#667eea', textDecoration: 'underline', fontWeight: '500' }}>
            Register
          </Link>
        </div>
      </div>
    </div>
  );
} 