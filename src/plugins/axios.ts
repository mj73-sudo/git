import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // فقط root بده
  timeout: 10000,
})

// 🔐 interceptor برای اضافه کردن توکن به همه درخواست‌ها
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// ❌ interceptor برای مدیریت خطاها
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('توکن منقضی شده یا نامعتبره')
      // اینجا می‌تونی route بزنی به login یا توکن رو پاک کنی
    }
    return Promise.reject(error)
  }
)

export default api
