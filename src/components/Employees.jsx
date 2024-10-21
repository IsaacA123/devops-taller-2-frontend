import { useEffect, useState } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AiOutlineLogout } from "react-icons/ai";

const API_BASE_URL = process.env.REACT_APP_API_URL;

const Employees = () => {
  const { storeId } = useParams(); 
  const [employees, setEmployees] = useState([]);
  const [newEmployee, setNewEmployee] = useState({ username: "", password: "", role: "employee" });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/stores/${storeId}/employees`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEmployees(response.data);
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
    fetchEmployees();
  }, []);

  const handleCreateEmployee = async () => {
    if (!newEmployee.username.trim() || !newEmployee.password) {
      setError('Completa todos los campos');
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/stores/${storeId}/employees`,
        newEmployee,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setEmployees([...employees, response.data]);
      setNewEmployee({ username: "", password: "", role: "employee" });
    } catch (error) {
      setError('Error al crear el empleado');
    }
  };
  const handleLogout = () => {
    navigate("/login");
    localStorage.clear('token');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
     <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Empleados</h1>
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


      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Agregar Empleado</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            value={newEmployee.username}
            onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
            placeholder="Nombre de usuario"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            value={newEmployee.password}
            onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
            placeholder="Contraseña"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleCreateEmployee}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-200"
        >
          Crear Empleado
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <h2 className="text-xl font-semibold mb-4">Empleados Existentes</h2>
      <ul>
        {employees.map((employee) => (
          <li key={employee.id} className="border border-gray-300 p-4 mb-4 rounded flex justify-between items-center">
            <span className="text-gray-700">{employee.id}</span>
            <span className="text-gray-700">{employee.username}</span>
            <span className="text-gray-700">{employee.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Employees;
