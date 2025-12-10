import React, { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const CustomerDashboard = () => {
  const [info, setInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token || role !== "customer") {
      window.location.href = "/";
      return;
    }
    fetchInfo();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchInfo = async () => {
    try {
      const res = await fetch(`${API}/customer/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (result.success) setInfo(result.data);
      else setError(result.message);
    } catch (err) {
      setError("Server error");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(`${API}/customer/me/transactions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const result = await res.json();
      if (result.success) setTransactions(result.data);
      else setError(result.message);
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {info && (
          <div className="bg-white p-4 rounded shadow mb-6">
            <p className="font-semibold">Name: {info.name}</p>
            <p className="font-semibold">Email: {info.email}</p>
            <p className="font-semibold">Balance: ₹{info.balance?.toFixed(2) || '0.00'}</p>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-3">Transactions</h2>
        {transactions.length === 0 ? (
          <p>No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {transactions.map((t) => (
              <li key={t.id} className="p-3 bg-white rounded shadow">
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{t.transaction_type}</div>
                    <div className="text-sm text-gray-600">₹{t.amount}</div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div>Balance: ₹{t.balance_after_transaction}</div>
                    <div>{new Date(t.created_at).toLocaleString()}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
