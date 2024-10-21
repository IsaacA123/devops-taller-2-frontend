import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = process.env.REACT_APP_API_URL;

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (password && confirmPassword) {
        setPasswordsMatch(password === confirmPassword);
    }
}, [password, confirmPassword]);

const handleSubmit = async (e) => {
  e.preventDefault();   
  setLoading(true);
  setError('');
  await axios.post(
    API_BASE_URL+"/auth/register",{
      username,
      password
  },
  {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(function (response) {
    console.log(response.data);
    localStorage.setItem('token', response.data.token);
    navigate("/stores");
  })
  .catch(function (error){
    let errorMessage = "Error desconocido";
      if (error.response) {
        errorMessage = error.response.data;
      } else if (error.request) {
        errorMessage = "No se recibió respuesta del servidor";
      } else {
        errorMessage = error.message;
      }
      console.error(errorMessage);
      setError(errorMessage.message);
  }).finally(function () {
    setLoading(false);
  });
}

  return (
    <div className="bg-background flex justify-center items-center text-center min-h-screen ">
      <div className="bg-secondary p-10 rounded shadow-custom-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-white">
          <div className="font-semibold text-primary text-2xl mb-2 text-center">Iniciar Sesión</div>
          {loading && <div className="flex justify-center mb-4">
              <img src="/spin.svg" className="animate-spin w-12 h-12" alt="Icono de carga" />
            </div>}
          {error && <p className="text-error font-semibold">{error}</p>}
          <div className="relative group mt-6">
            <input onChange={(e) => setUsername(e.target.value)} type="text" className="bg-secondary-light outline-none p-2 w-full peer"  placeholder="" required></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-100 ">Nombre de Usuario</label>
          </div>
          <div className="relative group mt-6">
            <input onChange={(e) => setPassword(e.target.value)} type="password" minLength="4" className="bg-secondary-light outline-none p-2 w-full peer"  placeholder="" required></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-100 ">Contraseña</label>
          </div>
          <div className="relative group mt-6">
            <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" minLength="4" className="bg-secondary-light outline-none p-2 w-full peer"  placeholder="" required></input>
            <label className="absolute py-2 h-full left-2 pointer-events-none group-focus-within:-translate-y-full peer-[:not(:placeholder-shown)]:-translate-y-full duration-100 ">Confirmar contraseña</label>
          </div>
          {!passwordsMatch && <p className="text-error">Las contraseñas no son iguales.</p>}
          <button type="submit" className="self-center text-black bg-primary rounded hover:bg-primary-dark font-bold px-4 py-2" disabled={loading}> {loading ? "Cargando..." : "Registrarse"}</button>
          <p className="text-white">¿Ya te has creado una cuenta? <a href="/" className="text-primary hover:underline">Iniciar sesión aquí</a></p>
        </form>
      </div>
    </div> 
  );
}
