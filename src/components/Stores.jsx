import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      alert('El nombre de la tienda no puede estar vacío');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/stores`,
        { name: newShopName }, // Datos enviados al backend
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setStores([...stores, response.data]); // Actualiza la lista de tiendas
      setNewShopName(''); // Limpia el campo de texto
      setIsCreating(false); // Oculta el formulario
    } catch (error) {
      setError('Error al crear la tienda');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Tiendas</h1>

      {/* Muestra el formulario solo si isCreating es true */}
      {isCreating ? (
        <div className="mb-4">
          <input
            type="text"
            value={newShopName}
            onChange={(e) => setNewShopName(e.target.value)}
            placeholder="Nombre de la nueva tienda"
            className="border p-2 rounded mr-2"
          />
          <button onClick={handleCreateShop} className="bg-blue-500 text-white px-4 py-2 rounded">
            Crear Tienda
          </button>
          <button onClick={() => setIsCreating(false)} className="bg-red-500 text-white px-4 py-2 rounded ml-2">
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Crear Tienda
        </button>
      )}

      {/* Mensaje de error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Lista de tiendas */}
      <ul>
        {stores.map((shop) => (
          <li key={shop.id} className="border p-2 mb-2">
            <span>{shop.name}</span>
            <button
              onClick={() => navigate(`/stores/${shop.id}/products`)}
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Ver Productos
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Stores;
