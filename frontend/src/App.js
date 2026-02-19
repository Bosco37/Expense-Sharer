import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Members from './components/Members';
import ExpenseForm from './components/ExpenseForm';
import Debts from './components/Debts';
import History from './components/History';
import MemberFilter from './components/MemberFilter';

const API = axios.create({ baseURL: 'http://localhost:5000' });

function App() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [memRes, expRes, debtRes] = await Promise.all([
        API.get('/members'),
        API.get('/expenses'),
        API.get('/debts')
      ]);
      setMembers(memRes.data);
      setExpenses(expRes.data);
      setDebts(debtRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const addMember = async (name) => {
    try {
      await API.post('/members', { name });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || 'Error'); }
  };

  const addExpense = async (expense) => {
    if (members.length === 0) return alert('Add members first!');
    try {
      await API.post('/expenses', expense);
      fetchData();
    } catch (err) { alert('Error adding expense'); }
  };

  const deleteMember = async (name) => {
    if (window.confirm(`Delete ${name}?`)) {
      try {
        await API.delete(`/members/${name}`);
        fetchData();
      } catch (err) {
        alert('Error deleting member');
      }
    }
  };

  const deleteExpense = async (id) => {
    if (window.confirm('Delete this expense?')) {
      try {
        await API.delete(`/expenses/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting expense');
      }
    }
  };

  if (loading) return <div className="container"><h1>Loading...</h1></div>;

  return (
    <div className="container">
      <h1>💰 Expense Sharer</h1>
      <div className="grid">
        <Members members={members} onAdd={addMember} onDelete={deleteMember} />
        <ExpenseForm members={members} onAdd={addExpense} />
      </div>
      <div className="grid">
        <Debts debts={debts} />
        <History expenses={expenses} onDelete={deleteExpense} />
      </div>
      <div className="card">
        <MemberFilter members={members} expenses={expenses} />
      </div>
    </div>
  );
}

export default App;