import React from 'react';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon,
  Assignment as AssignmentIcon,
  Undo as UndoIcon
} from '@mui/icons-material';
import '../styles/App.css';

// Utility function to format deadline dates
const formatDeadline = (deadline) => {
  if (!deadline) return 'No deadline';
  
  const date = new Date(deadline);
  const now = new Date();
  const diffTime = date.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  
  const formattedDate = date.toLocaleDateString('en-US', options);
  
  // Add relative time indicator
  let relativeTime = '';
  if (diffDays === 0) {
    relativeTime = ' (Today)';
  } else if (diffDays === 1) {
    relativeTime = ' (Tomorrow)';
  } else if (diffDays === -1) {
    relativeTime = ' (Yesterday)';
  } else if (diffDays > 1 && diffDays <= 7) {
    relativeTime = ` (In ${diffDays} days)`;
  } else if (diffDays < -1 && diffDays >= -7) {
    relativeTime = ` (${Math.abs(diffDays)} days ago)`;
  } else if (diffDays < 0) {
    relativeTime = ' (Overdue)';
  }
  
  return formattedDate + relativeTime;
};

const TaskList = ({ tasks, onEdit, onDelete, onCompleteTask }) => {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🎯</div>
        <h3 className="empty-state-title">Ready to get productive?</h3>
        <p className="empty-state-text">
          Start by creating your first task and take control of your day!
          Click the "Add New Task" button above to begin your journey to better productivity.
        </p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div className="task-header">
            <h3 className={`task-title ${task.completed ? 'completed' : ''}`}>
              {task.completed && <CheckIcon style={{ color: '#4caf50', marginRight: '8px', fontSize: '20px' }} />}
              {task.title}
            </h3>
            <span className={`task-status ${task.completed ? 'completed' : 'pending'}`}>
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
          
          {task.description && (
            <p className="task-description">{task.description}</p>
          )}
          
          <div className="task-meta">
            <div className="task-deadline">
              <ScheduleIcon fontSize="small" />
              <span className={task.deadline && new Date(task.deadline) < new Date() && !task.completed ? 'overdue' : ''}>
                {formatDeadline(task.deadline)}
              </span>
            </div>
            
            {task.category && (
              <div className="task-category">
                <CategoryIcon fontSize="small" />
                <span>{task.category.name}</span>
              </div>
            )}
          </div>
          
          <div className="task-actions">
            <button 
              className="task-button edit" 
              onClick={() => onEdit(task)}
              title="Edit task"
            >
              <EditIcon fontSize="small" />
              Edit
            </button>
            
            <button 
              className={`task-button ${task.completed ? 'uncomplete' : 'complete'}`}
              onClick={() => onCompleteTask(task._id)}
              title={task.completed ? 'Mark as uncompleted' : 'Mark as completed'}
            >
              {task.completed ? (
                <>
                  <UndoIcon fontSize="small" />
                  Uncomplete
                </>
              ) : (
                <>
                  <CheckIcon fontSize="small" />
                  Complete
                </>
              )}
            </button>
            
            <button 
              className="task-button delete" 
              onClick={() => onDelete(task._id)}
              title="Delete task"
            >
              <DeleteIcon fontSize="small" />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList; 