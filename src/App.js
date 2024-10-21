import  { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Stores from './components/Stores';
import Products from './components/Products';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:storeId/products" element={<Products />} />
      </Routes>
    </Router>
  )
}

export default App;
