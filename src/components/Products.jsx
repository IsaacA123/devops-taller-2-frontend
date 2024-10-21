import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const { storeId } = useParams(); 
  const [newProduct, setNewProduct] = useState({ name: "", price: "", stock: "" });
  const [isCreating, setIsCreating] = useState(false);
  const [editProduct, setEditProduct] = useState(null); 

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
        setError(errorMessage);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleCreateProduct = async () => {
    if (!newProduct.name.trim() || !newProduct.price || !newProduct.stock) {
      alert('Completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/stores/${storeId}/products`,
        { ...newProduct, store_id: storeId }, // Datos enviados al backend
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setProducts([...products, response.data]); // Actualiza la lista de productos
      setNewProduct({ name: "", price: "", stock: "" }); // Limpia el formulario
      setIsCreating(false); // Oculta el formulario
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

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Lista de Productos</h1>

      {isCreating || editProduct ? (
        <div className="mb-4">
          <input
            type="text"
            value={isCreating ? newProduct.name : editProduct.name}
            onChange={(e) =>
              isCreating
                ? setNewProduct({ ...newProduct, name: e.target.value })
                : setEditProduct({ ...editProduct, name: e.target.value })
            }
            placeholder="Nombre del producto"
            className="border p-2 rounded mr-2"
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
            className="border p-2 rounded mr-2"
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
            className="border p-2 rounded mr-2"
          />
          <button
            onClick={isCreating ? handleCreateProduct : handleEditProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isCreating ? "Crear Producto" : "Guardar Cambios"}
          </button>
          <button
            onClick={() => {
              isCreating ? setIsCreating(false) : setEditProduct(null);
            }}
            className="bg-red-500 text-white px-4 py-2 rounded ml-2"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button onClick={() => setIsCreating(true)} className="bg-green-500 text-white px-4 py-2 rounded mb-4">
          Crear Producto
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id} className="border p-2 mb-2">
            <span>{product.name}</span> - <span>${product.price}</span> - <span>Stock: {product.stock}</span>
            <button
              onClick={() => setEditProduct(product)} 
              className="bg-yellow-500 text-white px-4 py-2 rounded ml-2"
            >
              Editar
            </button>
            <button
              onClick={() => handleDeleteProduct(product.id)} 
              className="bg-red-500 text-white px-4 py-2 rounded ml-2"
            >
              Eliminar
            </button>
            <button
              onClick={() => handleUpdateStock(product.id, 'increase')} 
              className="bg-purple-500 text-white px-4 py-2 rounded ml-2"
            >
              Aumentar Stock
            </button>
            <button
              onClick={() => handleUpdateStock(product.id, 'decrease')} 
              className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
            >
              Disminuir Stock
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
