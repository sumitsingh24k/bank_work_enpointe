import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || 'https://bank-work.onrender.com';

const Modal = ({ title, balance, onClose, onConfirm, action }) => {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const v = Number(amount);
    if (!v || v <= 0) return setError("Enter a valid positive amount");
    onConfirm(v);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="mb-2">Available balance: ₹{balance?.toFixed(2) || '0.00'}</p>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded mb-2"
          placeholder="Enter amount"
        />
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">{action}</button>
        </div>
      </div>
    </div>
  );
};

const CustomerTransactions = () => {
  const [info, setInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null); // { type: 'deposit'|'withdraw' }

  const token = localStorage.getItem("token");

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'customer' || !token) {
      window.location.href = '/';
      return;
    }
    fetchInfo();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${API}/customer/me`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setInfo(result.data);
      else setError(result.message || 'Failed to fetch info');
    } catch (err) {
      setError('Server error');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/customer/me/transactions`, { headers: { Authorization: `Bearer ${token}` } });
      const result = await res.json();
      if (result.success) setTransactions(result.data);
      else setError(result.message || 'Failed to fetch transactions');
    } catch (err) {
      setError('Server error');
    }
    setLoading(false);
  };

  const openModal = (type) => setModal({ type });
  const closeModal = () => setModal(null);

  const handleConfirm = async (amount) => {
    if (!modal) return;
    const path = modal.type === 'deposit' ? 'deposit' : 'withdraw';
    try {
      const res = await fetch(`${API}/customer/me/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ amount }),
      });
      const result = await res.json();
      if (result.success) {
        // refresh info and transactions
        await fetchInfo();
        await fetchTransactions();
        closeModal();
      } else {
        setError(result.message || 'Operation failed');
      }
    } catch (err) {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Transactions</h1>
        {error && <div className="text-red-600 mb-3">{error}</div>}

        <div className="mb-4 flex gap-2">
          <button onClick={() => openModal('deposit')} className="px-4 py-2 bg-green-600 text-white rounded">Deposit</button>
          <button onClick={() => openModal('withdraw')} className="px-4 py-2 bg-red-600 text-white rounded">Withdraw</button>
        </div>

        <div className="bg-white p-4 rounded shadow mb-6">
          <p className="font-semibold">Name: {info?.name || 'N/A'}</p>
          <p className="font-semibold">Balance: ₹{info?.balance?.toFixed(2) || '0.00'}</p>
        </div>

        <h2 className="text-2xl font-semibold mb-3">History</h2>
        {loading ? (
          <div>Loading...</div>
        ) : transactions.length === 0 ? (
          <div>No transactions yet.</div>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li key={t.id} className="p-3 bg-white rounded shadow flex justify-between">
                <div>
                  <div className="font-semibold">{t.transaction_type}</div>
                  <div className="text-sm text-gray-600">₹{t.amount}</div>
                </div>
                <div className="text-sm text-gray-600 text-right">
                  <div>Balance: ₹{t.balance_after_transaction}</div>
                  <div>{new Date(t.created_at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modal && (
        <Modal
          title={modal.type === 'deposit' ? 'Deposit' : 'Withdraw'}
          balance={info?.balance}
          onClose={closeModal}
          onConfirm={handleConfirm}
          action={modal.type === 'deposit' ? 'Deposit' : 'Withdraw'}
        />
      )}
    </div>
  );
};

export default CustomerTransactions;
