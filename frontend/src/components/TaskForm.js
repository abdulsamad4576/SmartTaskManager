import React, { useState, useEffect } from 'react';
import { 
  Close as CloseIcon, 
  Save as SaveIcon,
  Title as TitleIcon,
  Description as DescriptionIcon,
  Schedule as ScheduleIcon,
  Category as CategoryIcon
} from '@mui/icons-material';
import '../styles/App.css';

const TaskForm = ({ onSubmit, categories, initialData = {}, onCancel }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [deadline, setDeadline] = useState(initialData?.deadline ? initialData.deadline.slice(0, 16) : '');
  const [category, setCategory] = useState(initialData?.category?.name || '');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setDeadline(initialData.deadline ? initialData.deadline.slice(0, 16) : '');
      setCategory(initialData.category?.name || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, deadline, category });
  };

  const isEditing = !!initialData?._id;

  return (
    <div className="modal-overlay task-form-overlay" onClick={onCancel}>
      <div className="modal-content task-form-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header task-form-header">
          <div className="modal-title">
            <div className="title-icon">
              <TitleIcon />
            </div>
            <div>
              <h3>{isEditing ? 'Edit Task' : 'Create New Task'}</h3>
              <p className="modal-subtitle">
                {isEditing ? 'Update your task details below' : 'Fill in the details to create a new task'}
              </p>
            </div>
          </div>
          <button className="modal-close" onClick={onCancel} title="Close">
            <CloseIcon />
          </button>
        </div>
        
        <div className="modal-body task-form-body">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">
                <TitleIcon fontSize="small" />
                Task Title *
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter a descriptive title for your task"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <DescriptionIcon fontSize="small" />
                Description
              </label>
              <textarea
                className="form-textarea"
                placeholder="Add more details about your task (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows="4"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">
                  <ScheduleIcon fontSize="small" />
                  Deadline
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <CategoryIcon fontSize="small" />
                  Category
                </label>
                <select 
                  className="form-select" 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </form>
        </div>
        
        <div className="modal-footer task-form-footer">
          <button 
            className="form-button secondary" 
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
          <button 
            className="form-button primary" 
            onClick={handleSubmit}
            disabled={!title.trim()}
            type="submit"
          >
            <SaveIcon fontSize="small" />
            {isEditing ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskForm; 