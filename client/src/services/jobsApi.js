import api from './api'

export const searchJobs = async (params) => {
  const res = await api.get('/jobs/search', { params })
  return res.data
}

export const getCategories = async () => {
  const res = await api.get('/jobs/categories')
  return res.data
}

export const getSavedJobs = async () => {
  const res = await api.get('/users/saved-jobs')
  return res.data
}

export const saveJob = async (job) => {
  const res = await api.post('/users/saved-jobs', job)
  return res.data
}

export const unsaveJob = async (jobId) => {
  const res = await api.delete(`/users/saved-jobs/${jobId}`)
  return res.data
}

export const getAllUsers = async () => {
  const res = await api.get('/users/all')
  return res.data
}

export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`)
  return res.data
}

export const updateUserRole = async (id, role) => {
  const res = await api.patch(`/users/${id}/role`, { role })
  return res.data
}