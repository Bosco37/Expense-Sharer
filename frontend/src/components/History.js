import React from 'react';

export default function History({ expenses, onDelete }) {
  return (
    <div className="card">
      <h2>📜 History</h2>
      {expenses.length === 0 ? (
        <p className="empty-msg">No expenses yet</p>
      ) : (
        expenses.slice().reverse().map(exp => (
          <div key={exp.id} className="history-item">
            <button 
              onClick={() => onDelete(exp.id)}
              className="delete-btn"
              style={{ position: 'absolute', right: '5px', top: '5px' }}
            >
              ✕
            </button>
            <div>
              <strong>{exp.paidBy}</strong> paid ₹{exp.amount}
            </div>
            <div className="description">
              {exp.description}
            </div>
            <small>{exp.date}</small>
          </div>
        ))
      )}
    </div>
  );
}