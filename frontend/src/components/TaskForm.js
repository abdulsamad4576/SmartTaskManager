import React, { useState, useEffect } from 'react';

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

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{ marginRight: 8 }}
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <input
        type="datetime-local"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        style={{ marginRight: 8 }}
      />
      <select value={category} onChange={e => setCategory(e.target.value)} style={{ marginRight: 8 }}>
        <option value="">Select Category</option>
        {categories.map(cat => (
          <option key={cat._id} value={cat.name}>{cat.name}</option>
        ))}
      </select>
      <button type="submit">Save</button>
      {onCancel && <button type="button" onClick={onCancel} style={{ marginLeft: 8 }}>Cancel</button>}
    </form>
  );
};

export default TaskForm; 