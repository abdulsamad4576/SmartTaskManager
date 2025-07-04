import React from 'react';
import { Schedule as ScheduleIcon } from '@mui/icons-material';
import '../styles/App.css';

export default function ReminderModal({ task, onClose }) {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <ScheduleIcon style={{ color: '#667eea', marginRight: '8px' }} />
            <h3>Task Reminder</h3>
          </div>
        </div>
        
        <div className="modal-body">
          <div style={{ 
            background: '#fff3cd', 
            color: '#856404', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            border: '1px solid #ffeaa7'
          }}>
            This task is due soon!
          </div>
          
          <div>
            <h4 style={{ marginBottom: '12px', color: '#333' }}>
              {task.title}
            </h4>
            
            {task.description && (
              <p style={{ color: '#666', marginBottom: '16px', lineHeight: '1.5' }}>
                {task.description}
              </p>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#888' }}>
              <ScheduleIcon fontSize="small" />
              <span>Due at: {new Date(task.deadline).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            onClick={onClose} 
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.target.style.transform = 'translateY(0)'}
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
} 