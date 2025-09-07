import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { postsApi, usersApi } from '../../services/api'
import type { Post, User } from '../../types'

const Homepage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [search, setSearch] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  // Kullanıcı ve gönderileri JSONPlaceholder'dan çekiyoruz
  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUsers = localStorage.getItem('users')
        const storedPosts = localStorage.getItem('posts')
        if (storedUsers && JSON.parse(storedUsers).length > 0) {
          setUsers(JSON.parse(storedUsers))
        } else {
          const dataUsers = await usersApi.list()
          setUsers(dataUsers)
        }
        if (storedPosts && JSON.parse(storedPosts).length > 0) {
          setPosts(JSON.parse(storedPosts))
        } else {
          const dataPosts = await postsApi.list()
          setPosts(dataPosts)
        }
      } catch (error) {
        setError((error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Arama sonuçlarını filtreleme
  const filteredUsers = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()))
  const filteredPosts = posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="min-h-screen text-gray-900 p-6">
      {/* Başlık */}
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">📊 Proje Gösterge Paneli</h1>

      {/* Arama Alanı */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Kullanıcı veya gönderi ara..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 w-full max-w-md rounded-xl border shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {/* Dashboard Kartları */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white flex flex-col gap-4 p-5 rounded-xl shadow hover:shadow-lg transition duration-300 text-center">
          <h2 className="text-lg font-semibold">👥 Toplam Kullanıcı</h2>
          <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          <Link to="/users" className="text-blue-600 hover:underline text-sm font-medium">
            Hepsini Göster →
          </Link>
        </div>
        <div className="bg-white flex flex-col gap-4 p-5 rounded-xl shadow hover:shadow-lg transition duration-300 text-center">
          <h2 className="text-lg font-semibold">📝 Toplam Gönderi</h2>
          <p className="text-3xl font-bold text-green-600">{posts.length}</p>
          <Link to="/posts" className="text-blue-600 hover:underline text-sm font-medium">
            Hepsini Göster →
          </Link>
        </div>
        <div className="bg-white flex flex-col gap-4 justify-center items-center p-5 rounded-xl shadow hover:shadow-lg transition duration-300 text-center">
          <h2 className="text-lg font-semibold">✨ Son Kullanıcı</h2>
          <p className="text-xl font-medium">Adı: {users[0]?.name || 'Yükleniyor...'}</p>
          <p className="text-xl font-medium">
            Kullanıcı Adı: {users[0]?.username || 'Yükleniyor...'}
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300 text-center">
          <h2 className="text-lg font-semibold">🔥 Son Gönderi</h2>
          <p className="text-xl font-medium">{posts[0]?.title || 'Yükleniyor...'}</p>
        </div>
      </div>
      {error && <span>{error}</span>}
      {loading && <span>{loading}</span>}

      {/* Son 5 Gönderi */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">📰 Son 5 Gönderi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts
            .reverse()
            .slice(0, 5)
            .map((post) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300"
              >
                <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                <Link to="/posts" className="text-blue-600 hover:underline text-sm font-medium">
                  Devamını oku →
                </Link>
              </div>
            ))}
        </div>
      </div>

      {/* Son 3 Kullanıcı */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">👥 Son 3 Kullanıcı</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.slice(0, 3).map((user) => (
            <div
              key={user.id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition duration-300"
            >
              <h3 className="font-semibold text-lg mb-1">{user.name}</h3>
              <p className="text-gray-600 text-sm mb-3">{user.email}</p>
              <Link
                to={`/users/${user.id}`}
                className="text-blue-600 hover:underline text-sm font-medium"
              >
                Profili Gör →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Homepage
