import React from 'react';

const TaskList = ({ tasks, onEdit, onDelete, onComplete }) => {
  if (!tasks.length) return <p>No tasks found.</p>;
  return (
    <ul>
      {tasks.map(task => (
        <li key={task._id} style={{ marginBottom: 16, border: '1px solid #ccc', padding: 12, borderRadius: 8 }}>
          <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
          <p>{task.description}</p>
          <p><b>Deadline:</b> {task.deadline ? new Date(task.deadline).toLocaleString() : 'None'}</p>
          <p><b>Category:</b> {task.category?.name || 'None'}</p>
          <p><b>Status:</b> {task.completed ? 'Completed' : 'Pending'}</p>
          <button onClick={() => onEdit(task)}>Edit</button>
          <button onClick={() => onDelete(task._id)} style={{ marginLeft: 8 }}>Delete</button>
          {!task.completed && <button onClick={() => onComplete(task._id)} style={{ marginLeft: 8 }}>Mark Completed</button>}
        </li>
      ))}
    </ul>
  );
};

export default TaskList; 