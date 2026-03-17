import api from './api'

export const authService = {
  login: (data) => api.post('/api/auth/login', data).then(r => r.data),
  register: (data) => api.post('/api/auth/register', data).then(r => r.data),
}

export const carService = {
  getAll: () => api.get('/api/cars').then(r => r.data),
  getOne: (id) => api.get(`/api/cars/${id}`).then(r => r.data),
  create: (data) => api.post('/api/cars', data).then(r => r.data),
  update: (id, data) => api.put(`/api/cars/${id}`, data).then(r => r.data),
  delete: (id) => api.delete(`/api/cars/${id}`),
}

export const modService = {
  getAll: (carId) => api.get(`/api/cars/${carId}/mods`).then(r => r.data),
  create: (carId, data) => api.post(`/api/cars/${carId}/mods`, data).then(r => r.data),
  update: (carId, modId, data) => api.put(`/api/cars/${carId}/mods/${modId}`, data).then(r => r.data),
  updateStatus: (carId, modId, status) =>
    api.patch(`/api/cars/${carId}/mods/${modId}/status`, { status }).then(r => r.data),
  delete: (carId, modId) => api.delete(`/api/cars/${carId}/mods/${modId}`),
}
