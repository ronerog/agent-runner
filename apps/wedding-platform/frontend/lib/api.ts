import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor: attach JWT access token
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// Response interceptor: handle 401 by refreshing token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token')
        if (refreshToken) {
          try {
            const response = await axios.post(`${BASE_URL}/auth/token/refresh/`, {
              refresh: refreshToken,
            })
            const newAccessToken: string = response.data.access
            localStorage.setItem('access_token', newAccessToken)

            if (originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            }
            return apiClient(originalRequest)
          } catch {
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            window.location.href = '/login'
          }
        } else {
          window.location.href = '/login'
        }
      }
    }

    return Promise.reject(error)
  },
)

// ─── Type definitions ────────────────────────────────────────────────────────

export interface LoginResponse {
  access: string
  refresh: string
}

export interface WeddingData {
  id?: string
  title: string
  slug: string
  bride_name: string
  groom_name: string
  wedding_date?: string
  venue_name?: string
  venue_address?: string
  description?: string
  is_published?: boolean
  cover_image?: string
  pages?: WeddingPageData[]
}

export interface WeddingPageData {
  id?: string
  wedding?: string
  section_type: string
  content: Record<string, unknown>
  order?: number
  is_visible?: boolean
}

export interface GuestData {
  id?: string
  wedding: string
  name: string
  email?: string
  phone?: string
  status?: string
}

export interface RSVPData {
  guest: string
  confirmed: boolean
  plus_one?: boolean
  plus_one_name?: string
  dietary_restrictions?: string
  message?: string
}

export interface GiftData {
  id?: string
  wedding: string
  name: string
  description?: string
  price?: number
  image_url?: string
  external_link?: string
  is_purchased?: boolean
  purchased_by?: string
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const auth = {
  async register(email: string, name: string, password: string) {
    const response = await apiClient.post('/auth/register/', { email, name, password })
    return response.data
  },

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/token/', { email, password })
    return response.data
  },

  async refreshToken(refresh: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/token/refresh/', { refresh })
    return response.data
  },

  async me() {
    const response = await apiClient.get('/auth/me/')
    return response.data
  },
}

// ─── Weddings API ─────────────────────────────────────────────────────────────

export const weddings = {
  async list() {
    const response = await apiClient.get('/weddings/')
    return response.data
  },

  async create(data: WeddingData) {
    const response = await apiClient.post('/weddings/', data)
    return response.data
  },

  async getBySlug(slug: string) {
    const response = await apiClient.get(`/weddings/by-slug/${slug}/`)
    return response.data
  },

  async update(id: string, data: Partial<WeddingData>) {
    const response = await apiClient.patch(`/weddings/${id}/`, data)
    return response.data
  },

  async remove(id: string) {
    await apiClient.delete(`/weddings/${id}/`)
  },
}

// ─── Wedding Pages API ────────────────────────────────────────────────────────

export const weddingPages = {
  async list(weddingId: string) {
    const response = await apiClient.get('/weddings/pages/', { params: { wedding: weddingId } })
    return response.data
  },

  async update(id: string, data: Partial<WeddingPageData>) {
    const response = await apiClient.patch(`/weddings/pages/${id}/`, data)
    return response.data
  },
}

// ─── Guests API ───────────────────────────────────────────────────────────────

export const guests = {
  async list(weddingId: string) {
    const response = await apiClient.get('/guests/', { params: { wedding: weddingId } })
    return response.data
  },

  async create(weddingId: string, data: Omit<GuestData, 'wedding'>) {
    const response = await apiClient.post('/guests/', { ...data, wedding: weddingId })
    return response.data
  },

  async remove(id: string) {
    await apiClient.delete(`/guests/${id}/`)
  },
}

// ─── RSVP API ─────────────────────────────────────────────────────────────────

export const rsvp = {
  async create(guestId: string, data: Omit<RSVPData, 'guest'>) {
    const response = await apiClient.post('/guests/rsvp/', { ...data, guest: guestId })
    return response.data
  },
}

// ─── Gifts API ────────────────────────────────────────────────────────────────

export const gifts = {
  async list(weddingId: string) {
    const response = await apiClient.get('/gifts/', { params: { wedding_id: weddingId } })
    return response.data
  },

  async create(weddingId: string, data: Omit<GiftData, 'wedding'>) {
    const response = await apiClient.post('/gifts/', { ...data, wedding: weddingId })
    return response.data
  },

  async remove(id: string) {
    await apiClient.delete(`/gifts/${id}/`)
  },

  async markPurchased(id: string, purchasedBy: string) {
    const response = await apiClient.post(`/gifts/${id}/mark-purchased/`, {
      purchased_by: purchasedBy,
    })
    return response.data
  },
}

export default apiClient
