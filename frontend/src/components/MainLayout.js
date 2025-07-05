import React from 'react';
import { Logout as LogoutIcon, Add as AddIcon } from '@mui/icons-material';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import CategoryFilter from './CategoryFilter';
import '../styles/App.css';

export default function MainLayout({
  user,
  onLogout,
  tasks,
  categories,
  filterCategory,
  setFilterCategory,
  loading,
  showForm,
  editingTask,
  onAddTask,
  onSaveTask,
  onCancelForm,
  onEditTask,
  onDeleteTask,
  onCompleteTask
}) {
  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="app-header-content">
          <h1 className="app-title">Smart Task Manager</h1>
          <div className="user-section">
            <span className="user-greeting">Welcome back, {user}! 👋</span>
            <button className="logout-button" onClick={onLogout}>
              <LogoutIcon fontSize="small" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-card">
          {/* Category Filter */}
          <div className="category-filter">
            <CategoryFilter
              categories={categories}
              value={filterCategory}
              onChange={setFilterCategory}
            />
          </div>

          {/* Add Task Button */}
          <div className="add-task-section">
            <button className="add-task-button" onClick={onAddTask}>
              <AddIcon />
              <span>Add New Task</span>
            </button>
          </div>

          {/* Task List */}
          <div>
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p style={{ marginTop: '16px', color: 'var(--text-muted)', fontSize: '14px' }}>
                  Loading your tasks...
                </p>
              </div>
            ) : (
              <TaskList
                tasks={tasks}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onCompleteTask={onCompleteTask}
              />
            )}
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          onSubmit={onSaveTask}
          categories={categories}
          initialData={editingTask}
          onCancel={onCancelForm}
        />
      )}
    </div>
  );
} 