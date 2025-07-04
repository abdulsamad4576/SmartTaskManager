import React from 'react';

const CategoryFilter = ({ categories, value, onChange }) => (
  <select value={value} onChange={e => onChange(e.target.value)} style={{ marginBottom: 16 }}>
    <option value="">All Categories</option>
    {categories.map(cat => (
      <option key={cat._id} value={cat.name}>{cat.name}</option>
    ))}
  </select>
);

export default CategoryFilter; 