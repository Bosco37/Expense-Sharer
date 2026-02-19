import React from 'react';

export default function Debts({ debts }) {
  const total = debts.reduce((sum, d) => sum + d.amount, 0);
  return (
    <div className="card">
      <h2>💸 Expenses</h2>
      {debts.length === 0 ? (
        <p className="empty-msg green">✨ All settled up!</p>
      ) : (
        <>
          {debts.map((d, i) => (
            <div className="debt-item" key={i}>
              <div>
                <span className="red">{d.from}</span> owes <span className="green">{d.to}</span>
              </div>
              <span className="red">₹{d.amount.toFixed(2)}</span>
            </div>
          ))}
          <div style={{textAlign:'right', marginTop:10, fontWeight:'bold'}}>
            Total: ₹{total.toFixed(2)}
          </div>
        </>
      )}
    </div>
  );
}