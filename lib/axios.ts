import axios from "axios"

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api", // Ajusta la URL según tu backend
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor de respuesta para manejo global de errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Aquí puedes personalizar el manejo de errores global
    // Por ejemplo, mostrar notificaciones o redirigir en caso de 401
    return Promise.reject(error)
  }
)

export default api 