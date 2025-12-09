import LoginOrSignups from "./components/Login";
import Bankers from "./components/Bankers";
import Customers from "./components/Customers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginOrSignups />} />
        <Route path="/banker/dashboard" element={<Bankers />} />
        <Route path="/banker/customer/:id" element={<Customers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

