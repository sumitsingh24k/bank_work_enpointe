import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Customers = () => {
  const { id } = useParams();

  const [customerInfo, setCustomerInfo] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check banker login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "banker") {
      window.location.href = "/";
    } else {
      fetchCustomerInfo();
      fetchTransactions();
    }
  }, [id]);

  // Fetch customer basic info
  const fetchCustomerInfo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/banker/customer/${id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      });

      const result = await res.json();
      if (result.success) {
        setCustomerInfo(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/banker/customer/${id}/transactions`,
        {
          headers: { Authorization: localStorage.getItem("token") },
        }
      );

      const result = await res.json();
      if (result.success) {
        setTransactions(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6 sm:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
        >
          ← Back
        </button>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Customer Information Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Customer Details</h1>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name Card */}
              <div className="bg-linear-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-indigo-200">
                <p className="text-gray-600 text-sm font-semibold uppercase">Name</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{customerInfo.name || "N/A"}</p>
              </div>

              {/* Email Card */}
              <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-6 border border-emerald-200">
                <p className="text-gray-600 text-sm font-semibold uppercase">Email</p>
                <p className="text-lg font-bold text-gray-800 mt-2 wrap-break-word">{customerInfo.email || "N/A"}</p>
              </div>

              {/* Balance Card */}
              <div className="bg-linear-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <p className="text-gray-600 text-sm font-semibold uppercase">Current Balance</p>
                <p className="text-2xl font-bold text-purple-600 mt-2">
                  ₹{typeof customerInfo.balance === "number" ? customerInfo.balance.toFixed(2) : "0.00"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Transaction History Section */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No transactions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-indigo-600 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Balance After</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          t.transaction_type === "Deposit" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {t.transaction_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">₹{t.amount}</td>
                      <td className="px-6 py-4 text-gray-600">₹{t.balance_after_transaction}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(t.created_at).toLocaleDateString()} {new Date(t.created_at).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Customers;
