import type { Post, User } from '../types'

const BASE = 'https://jsonplaceholder.typicode.com'

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return (await res.json()) as T
}

// USERS
export const usersApi = {
  list: () => http<User[]>('/users'),
  create: (u: Omit<User, 'id'>) =>
    http<User>('/users', { method: 'POST', body: JSON.stringify(u) }),
  update: (id: number, u: Partial<User>) =>
    http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(u) }),
  remove: (id: number) => http<unknown>(`/users/${id}`, { method: 'DELETE' }),
}

// POSTS
export const postsApi = {
  list: () => http<Post[]>('/posts'),
  create: (p: Omit<Post, 'id'>) =>
    http<Post>('/posts', { method: 'POST', body: JSON.stringify(p) }),
  update: (id: number, p: Partial<Post>) =>
    http<Post>(`/posts/${id}`, { method: 'PUT', body: JSON.stringify(p) }),
  remove: (id: number) => http<unknown>(`/posts/${id}`, { method: 'DELETE' }),
}
