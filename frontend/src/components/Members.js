import React, { useState } from 'react';

export default function Members({ members, onAdd, onDelete }) {
  const [name, setName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim());
      setName('');
    }
  };

  return (
    <div className="card">
      <h2>👥 Members</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Enter name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <button type="submit">Add</button>
      </form>
      <ul className="list">
        {members.length ? members.map(m => (
          <li key={m}>
            <span>{m}</span>
            <button 
              onClick={() => onDelete(m)}
              className="delete-btn"
            >
              ✕
            </button>
          </li>
        )) : <li className="empty-msg">No members</li>}
      </ul>
    </div>
  );
}