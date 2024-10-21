import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Stores from './components/Stores';
import Products from './components/Products';
import Employees from './components/Employees';
import { ToastContainer } from 'react-toastify';


function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:storeId/products" element={<Products />} />
        <Route path="/stores/:storeId/employees" element={<Employees />} />

      </Routes>
    </Router>
  )
}

export default App;
