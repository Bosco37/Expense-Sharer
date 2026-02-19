import React, { useState } from 'react';

export default function MemberFilter({ members, expenses }) {
  const [selected, setSelected] = useState('');

  const calculateBalance = (member) => {
    if (!member) return 0;
    let balance = 0;
    expenses.forEach(exp => {
      if (exp.paidBy === member) balance += exp.amount;
      const share = exp.amount / members.length;
      balance -= share;
    });
    return balance;
  };

  const balance = selected ? calculateBalance(selected) : 0;

  return (
    <div>
      <h2>🔍 Member Filter</h2>
      <select value={selected} onChange={e => setSelected(e.target.value)}>
        <option value="">Select a member</option>
        {members.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      {selected && (
        <div style={{ marginTop: 15, padding: 10, background: '#f8f9fa', borderRadius: 5 }}>
          <strong>{selected}</strong> {balance >= 0 ? 'receives' : 'owes'} 
          <span className={balance >= 0 ? 'green' : 'red'}>
            {' '}₹{Math.abs(balance).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}