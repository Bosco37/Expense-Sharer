import React, { useState } from 'react';

export default function ExpenseForm({ members, onAdd }) {
  const [paidBy, setPaidBy] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!paidBy || !amount) return alert('Select payer and enter amount');
    onAdd({ 
      paidBy, 
      amount: parseFloat(amount), 
      description: description || 'Expense' 
    });
    setPaidBy('');
    setAmount('');
    setDescription('');
  };

  return (
    <div className="card">
      <h2>➕ Split Expense</h2>
      <form onSubmit={handleSubmit}>
        <select value={paidBy} onChange={e => setPaidBy(e.target.value)} required>
          <option value="">Who paid?</option>
          {members.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input 
          type="number" 
          step="0.01" 
          min="0.01" 
          placeholder="Amount" 
          value={amount} 
          onChange={e => setAmount(e.target.value)} 
          required 
        />
        <input 
          type="text" 
          placeholder="Description (optional)" 
          value={description} 
          onChange={e => setDescription(e.target.value)} 
        />
        <button type="submit" className="green-btn">Add Expense</button>
      </form>
    </div>
  );
}