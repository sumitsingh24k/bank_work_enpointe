import React, { useEffect, useState } from "react";

const Bankers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Check if banker is logged in
  const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "banker") {
      window.location.href = "/";
    } else {
      fetchCustomers();
    }
  }, []);

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API}/banker/customers`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await res.json();

      if (result.success) {
        setCustomers(result.data);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("Server error");
    }
    setLoading(false);
  };

  // Go to customer details page
  const viewDetails = (id) => {
    window.location.href = `/banker/customer/${id}`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-6 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Banker Dashboard</h1>
          <p className="text-gray-600">Manage and view customer accounts</p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="ml-4 text-gray-600 text-lg">Loading customers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && customers.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 text-lg">No customers found</p>
          </div>
        )}

        {/* Customers Table */}
        {!loading && customers.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-linear-to-r from-indigo-600 to-purple-600">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Email</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Balance</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-gray-50 transition duration-150">
                      <td className="px-6 py-4 text-gray-800 font-medium">{cust.name}</td>
                      <td className="px-6 py-4 text-gray-600">{cust.email}</td>
                      <td className="px-6 py-4 text-gray-800 font-semibold">
                        ${typeof cust.balance === "number" ? cust.balance.toFixed(2) : "0.00"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => viewDetails(cust.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 transform hover:scale-105"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer Info */}
        {!loading && customers.length > 0 && (
          <div className="mt-6 text-right text-gray-600">
            <p>Total Customers: <span className="font-bold text-gray-800">{customers.length}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bankers;
