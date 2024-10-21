import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlinePlus, AiOutlineEdit, AiOutlineDelete, AiOutlineStock, AiOutlineLogout } from "react-icons/ai"; // Add icons
import { toast } from "react-toastify"; // For notifications

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const { storeId } = useParams(); 
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [editProduct, setEditProduct] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stores/${storeId}/products`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setProducts(response.data);
      } catch (error) {
        let errorMessage = "Error desconocido";
        if (error.response) {
          errorMessage = error.response.data;
        } else if (error.request) {
          errorMessage = "No se recibió respuesta del servidor";
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage.message);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) {
      setError("Completa todos los campos")
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/stores/${storeId}/products`,
        { ...newProduct, store_id: storeId },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProducts([...products, response.data]);
      setNewProduct({ name: "", price: "", stock: "" });
      setIsCreating(false);
    } catch (error) {
      setError('Error al crear el producto');
    }
  };

  const handleEditProduct = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/stores/${storeId}/products/${editProduct.id}`,
        { ...editProduct },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProducts(products.map(p => p.id === editProduct.id ? response.data : p));
      setEditProduct(null);
    } catch (error) {
      setError('Error al editar el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/stores/${storeId}/products/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      setError('Error al eliminar el producto');
    }
  };

  const handleUpdateStock = async (productId, action) => {
    try {
      const productToUpdate = products.find(p => p.id === productId);
      const updatedStock = action === 'increase' ? productToUpdate.stock + 1 : productToUpdate.stock - 1;

      const response = await axios.put(
        `${API_BASE_URL}/stores/${storeId}/products/${productId}`,
        { ...productToUpdate, stock: updatedStock },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProducts(products.map(p => p.id === productId ? response.data : p));
    } catch (error) {
      setError('Error al actualizar el stock');
    }
  };

  const handleLogout = () => {
    navigate("/login");
    localStorage.clear('token');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg transition-transform duration-300 transform hover:scale-105">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Productos</h1>
        <button 
          onClick={handleLogout} 
          className="text-lg text-gray-600 hover:text-gray-900 flex items-center"
        >
          <AiOutlineLogout className="mr-2" /> Cerrar sesión
        </button>        <button onClick={() => navigate("/stores")} 
          className="bg-blue-500 text-white text-lg font-semibold py-2 px-4 rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-blue-600 hover:shadow-lg mb-4">
          Volver atras
        </button>
      </div>

      {isCreating || editProduct ? (
        <div className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={isCreating ? newProduct.name : editProduct.name}
              onChange={(e) =>
                isCreating
                  ? setNewProduct({ ...newProduct, name: e.target.value })
                  : setEditProduct({ ...editProduct, name: e.target.value })
              }
              placeholder="Nombre del producto"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={isCreating ? newProduct.price : editProduct.price}
              onChange={(e) =>
                isCreating
                  ? setNewProduct({ ...newProduct, price: e.target.value })
                  : setEditProduct({ ...editProduct, price: e.target.value })
              }
              placeholder="Precio"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={isCreating ? newProduct.stock : editProduct.stock}
              onChange={(e) =>
                isCreating
                  ? setNewProduct({ ...newProduct, stock: e.target.value })
                  : setEditProduct({ ...editProduct, stock: e.target.value })
              }
              placeholder="Stock"
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <button
              onClick={isCreating ? handleCreateProduct : handleEditProduct}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            >
              {isCreating ? <AiOutlinePlus /> : <AiOutlineEdit />} {isCreating ? "Crear Producto" : "Guardar Cambios"}
            </button>
            <button
              onClick={() => {
                isCreating ? setIsCreating(false) : setEditProduct(null);
              }}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-6 hover:bg-green-600 transition duration-200">
          <AiOutlinePlus /> nuevo producto
        </button>
      )}

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id} className="border border-gray-300 p-4 mb-4 rounded flex justify-between items-center transition-transform duration-200 transform hover:scale-105">
            <span className="text-gray-700">{product.name}</span>
            <span className="text-gray-700">${product.price}</span>
            <span className="text-gray-700">Stock: {product.stock}</span>
            <div className="ml-4 flex space-x-2">
              <button
                onClick={() => setEditProduct(product)} 
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition duration-200"
              >
                <AiOutlineEdit /> Editar
              </button>
              <button
                onClick={() => handleDeleteProduct(product.id)} 
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition duration-200"
              >
                <AiOutlineDelete /> Eliminar
              </button>
              <button
                onClick={() => handleUpdateStock(product.id, 'increase')} 
                className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition duration-200"
              >
                <AiOutlineStock /> Aumentar Stock
              </button>
              <button
                onClick={() => handleUpdateStock(product.id, 'decrease')} 
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-200"
              >
                <AiOutlineStock /> Disminuir Stock
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
