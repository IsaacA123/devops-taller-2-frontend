import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlinePlus, AiOutlineLogout, AiOutlineShopping, AiOutlineTeam } from 'react-icons/ai';
import { toast } from "react-toastify";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [error, setError] = useState('');
  const [newShopName, setNewShopName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stores`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setStores(response.data);
      } catch (error) {
        let errorMessage = "Error desconocido";
        if (error.response) {
          errorMessage = error.response.data;
        } else if (error.request) {
          errorMessage = "No se recibió respuesta del servidor";
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
      }
    };
    fetchStores();
  }, []);

  const handleCreateShop = async () => {
    if (!newShopName.trim()) {
      toast.error('El nombre de la tienda no puede estar vacío');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/stores`,
        { name: newShopName }, 
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStores([...stores, response.data]);
      setNewShopName('');
      setIsCreating(false);
      toast.success('Tienda creada con éxito');
    } catch (error) {
      setError('Error al crear la tienda');
      toast.error('Error al crear la tienda');
    }
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear('token');
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Tiendas</h1>
        <button 
          onClick={handleLogout} 
          className="text-lg text-gray-600 hover:text-gray-900 flex items-center"
        >
          <AiOutlineLogout className="mr-2" /> Cerrar sesión
        </button>
      </div>

      {isCreating ? (
        <div className="mb-6 flex items-center space-x-4">
          <input
            type="text"
            value={newShopName}
            onChange={(e) => setNewShopName(e.target.value)}
            placeholder="Nombre de la nueva tienda"
            className="border border-gray-300 p-2 rounded w-64"
          />
          <button 
            onClick={handleCreateShop} 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            <AiOutlinePlus className="inline mr-1" /> Crear Tienda
          </button>
          <button 
            onClick={() => setIsCreating(false)} 
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button 
          onClick={() => setIsCreating(true)} 
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition mb-6"
        >
          <AiOutlinePlus className="inline mr-1" /> Crear Tienda
        </button>
      )}

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((shop) => (
          <li key={shop.id} className="border border-gray-300 p-6 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-800">{shop.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => navigate(`/stores/${shop.id}/products`)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  <AiOutlineShopping className="inline mr-1" /> Productos
                </button>
                <button
                  onClick={() => navigate(`/stores/${shop.id}/employees`)}
                  className="bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                >
                  <AiOutlineTeam className="inline mr-1" /> Empleados
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stores;
