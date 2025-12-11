import LoginOrSignups from "./components/Login";
import Bankers from "./components/Bankers";
import Customers from "./components/Customers";
import CustomerDashboard from "./components/CustomerDashboard";
import CustomerTransactions from "./components/CustomerTransactions";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginOrSignups />} />
        <Route path="/banker/dashboard" element={<Bankers />} />
        <Route path="/banker/customer/:id" element={<Customers />} />
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        {/* Keep singular path working in production (legacy link) */}
        <Route path="/customer/transaction" element={<CustomerTransactions />} />
        <Route path="/customer/transactions" element={<CustomerTransactions />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

