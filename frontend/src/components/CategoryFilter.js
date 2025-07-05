import React from 'react';
import '../styles/App.css';

const CategoryFilter = ({ categories, value, onChange }) => (
  <select 
    className="filter-select" 
    value={value} 
    onChange={e => onChange(e.target.value)}
  >
    <option value="">All Categories</option>
    {categories.map(cat => (
      <option key={cat._id} value={cat.name}>{cat.name}</option>
    ))}
  </select>
);

export default CategoryFilter; 