import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'data.json';

async function initData() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify({ members: [], expenses: [] }));
  }
}
initData();

const readData = async () => JSON.parse(await fs.readFile(DATA_FILE));
const writeData = async (data) => await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));

function calculateDebts(members, expenses) {
  if (members.length === 0) return [];

  let balances = {};
  members.forEach(m => balances[m] = 0);
  expenses.forEach(exp => {
    const share = exp.amount / members.length;
    balances[exp.paidBy] += exp.amount - share;
    members.forEach(m => {
      if (m !== exp.paidBy) balances[m] -= share;
    });
  });

  let debts = [];
  let sorted = Object.entries(balances).sort((a, b) => a[1] - b[1]);
  let i = 0, j = sorted.length - 1;
  while (i < j) {
    let debtor = sorted[i];
    let creditor = sorted[j];
    let amount = Math.min(-debtor[1], creditor[1]);
    if (amount > 0.01) {
      debts.push({
        from: debtor[0],
        to: creditor[0],
        amount: Math.round(amount * 100) / 100
      });
      debtor[1] += amount;
      creditor[1] -= amount;
    }
    if (Math.abs(debtor[1]) < 0.01) i++;
    if (Math.abs(creditor[1]) < 0.01) j--;
  }
  return debts;
}

app.get('/members', async (req, res) => {
  const data = await readData();
  res.json(data.members);
});

app.post('/members', async (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name required' });
  const data = await readData();
  if (data.members.includes(name)) return res.status(400).json({ error: 'Duplicate member' });
  data.members.push(name);
  await writeData(data);
  res.json(data.members);
});

app.delete('/members/:name', async (req, res) => {
  const { name } = req.params;
  const data = await readData();
  data.members = data.members.filter(m => m !== name);
  await writeData(data);
  res.json({ message: 'Member deleted' });
});

app.get('/expenses', async (req, res) => {
  const data = await readData();
  res.json(data.expenses);
});

app.post('/expenses', async (req, res) => {
  const { paidBy, amount, description } = req.body;
  const data = await readData();
  if (!data.members.includes(paidBy)) return res.status(400).json({ error: 'Invalid member' });
  
  const expense = {
    id: Date.now(),
    paidBy,
    amount: parseFloat(amount),
    description: description || 'Expense',
    date: new Date().toLocaleString()
  };
  data.expenses.push(expense);
  await writeData(data);
  res.json(expense);
});

app.delete('/expenses/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readData();
  data.expenses = data.expenses.filter(e => e.id != id);
  await writeData(data);
  res.json({ message: 'Expense deleted' });
});

app.get('/debts', async (req, res) => {
  const data = await readData();
  const debts = calculateDebts(data.members, data.expenses);
  res.json(debts);
});

app.get('/transactions', async (req, res) => {
  const data = await readData();
  res.json(data.expenses);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));