import { useEffect, useMemo, useState } from 'react'
import { postsApi, usersApi } from '../../services/api'
import type { Post, User } from '../../types'
import PostForm from '../../components/PostForm'
import { toast } from 'sonner'

function Posts() {
  const [posts, setPosts] = useState<Post[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // ✅ Formu aç/kapat
  const openAddForm = () => {
    setSelectedPost(null)
    setIsFormOpen(true)
  }

  const openEditForm = (post: Post) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedPost(post)
    setIsFormOpen(true)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const storedPosts = localStorage.getItem('posts')
        const storedUsers = localStorage.getItem('users')

        if (storedPosts && JSON.parse(storedPosts).length > 0) {
          setPosts(JSON.parse(storedPosts)) // localStorage'dan al
        } else {
          const data = await postsApi.list()
          setPosts(data) // API'den al
          localStorage.setItem('posts', JSON.stringify(data)) // localStorage'a kaydet
        }
        if (storedUsers && JSON.parse(storedUsers).length > 0) {
          setUsers(JSON.parse(storedUsers)) // localStorage'dan al
        } else {
          const data = await usersApi.list()
          setUsers(data) // API'den al
          localStorage.setItem('users', JSON.stringify(data)) // localStorage'a kaydet
        }
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, []) // Bu effect yalnızca bir kez çalışır

  const filtered = useMemo(() => {
    if (!filter) return posts // Eğer filtre yoksa, tüm postları döndür
    const f = filter.toLowerCase() // Filtre terimini küçük harfe çevir
    // Kullanıcıları filtrele (username'e göre)
    const filteredUsers = users.filter((user) => user.username.toLowerCase().includes(f))
    // Filtrelenmiş postlar (başlık, id veya userId üzerinden)
    const filteredPosts = posts.filter((post) =>
      [post.userId, post.id, post.title].some((x) => String(x).toLowerCase().includes(f))
    )
    // Kullanıcı adı filtresi varsa, sadece bu kullanıcılara ait postları döndür
    const filteredUserIds = filteredUsers.map((user) => user.id)
    console.log('Filtered User IDs:', filteredUserIds)
    // Filtrelenmiş kullanıcılara ait postları al
    const postsForFilteredUsers = posts.filter((post) => filteredUserIds.includes(post.userId))
    console.log('Posts for Filtered Users:', postsForFilteredUsers)
    // Eğer kullanıcı adı filtresi varsa, sadece bu kullanıcılara ait postları döndür
    if (filteredUsers.length > 0) {
      return postsForFilteredUsers
    }
    // Eğer kullanıcı adı filtresi yoksa, sadece başlık veya id üzerinden postları döndür
    return filteredPosts
  }, [posts, filter, users, posts])

  async function createPost(data: Omit<Post, 'id'>) {
    const tempId = Math.max(0, ...posts.map((p) => p.id)) + 1
    const newPost: Post = { id: tempId, ...data }
    setPosts((prev) => [...prev, newPost])
    try {
      const created = await postsApi.create(data)
      setPosts((prev) => prev.map((p) => (p.id === tempId ? { ...created, id: tempId } : p)))
      const fullData = [newPost, ...posts]
      localStorage.setItem('posts', JSON.stringify(fullData))
      setIsFormOpen(true)
    } catch (e) {
      setPosts((prev) => prev.filter((p) => p.id !== tempId))
      alert(`Create failed: ${(e as Error).message}`)
      toast.error(`Gönderi oluşturulamadı: ${(e as Error).message}`)
    } finally {
      setIsFormOpen(false)
    }
  }

  async function updatePost(data: Post) {
    setIsFormOpen(true)
    try {
      const updatedPosts = posts.map((p) => (p.id === data.id ? data : p))

      setPosts(updatedPosts)
      await postsApi.update(data.id, data)

      localStorage.setItem('posts', JSON.stringify(updatedPosts)) // ✅ doğru liste
    } catch (e) {
      toast.message(`Güncelleme hatası: ${(e as Error).message}`)
    } finally {
      setIsFormOpen(false)
    }
  }

  async function deletePost(id: number) {
    const keep = posts
    const filterPost: Post[] = posts.filter((post) => post.id !== id)
    setPosts(filterPost)
    try {
      await postsApi.remove(id)
      localStorage.setItem('posts', JSON.stringify(filterPost))
      toast.success('Gönderi silindi.')
    } catch (e) {
      toast.message(`Silme hatası: ${(e as Error).message}`)
      setPosts(keep)
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    )
  if (error) return <p>Error: {error}</p>

  return (
    <div className="px-4 mt-10">
      <section className="container mx-auto w-full flex flex-col min-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-center">
          <h2 className="text-2xl md:text-3xl my-3 font-bold">Gönderiler Listesi</h2>
          {filtered.length > 0 && (
            <p className="text-end">
              <strong>{filtered.length}</strong> adet gönderi bulundu.
            </p>
          )}
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
            <input
              className="px-2 py-1 border border-slate-300 rounded-md"
              placeholder="Gönderilerde ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className="px-3 py-1 bg-blue-600 text-white rounded-lg cursor-pointer"
              onClick={() => openAddForm()}
            >
              + Gönderi ekle
            </button>
          </div>
        </header>
        {isFormOpen && (
          <PostForm
            initial={selectedPost ?? undefined}
            users={users}
            onUpdate={selectedPost ? updatePost : () => {}}
            onCreate={!selectedPost ? createPost : () => {}}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedPost(null)
            }}
          />
        )}
        {filtered.length === 0 && (
          <div className="flex justify-center mt-5">
            <span className="text-red-600">Gönderi bulunamadı!</span>
          </div>
        )}
        {filtered.length > 0 && (
          <table className="table w-full text-xs lg:text-base my-10">
            <thead className="border-b">
              <tr className="text-center">
                <th className="">userId/@username</th>
                <th className="">PostId</th>
                <th className="">Title</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="border-b wrap-break-word border-b-gray-600 mx-4 text-center"
                >
                  <td className="py-3">
                    <span className="badge">
                      {users.find((u) => u.id === p.userId)
                        ? `${p.userId} / @${users.find((u) => u.id === p.userId)?.username}`
                        : 'Bu kullanıcı silindi'}
                    </span>
                  </td>
                  <td className="py-3">{p.id}</td>
                  <td className="py-3">{p.title}</td>
                  <td className="py-3">
                    <button
                      className="px-2 py-1 mr-2 bg-amber-200 cursor-pointer rounded-md disabled:bg-amber-100 disabled:cursor-not-allowed"
                      onClick={() => openEditForm(p)}
                      disabled={isFormOpen}
                    >
                      Düzenle
                    </button>
                    <button
                      className="px-2 py-1 mt-2 sm:mt-0 bg-red-500 text-white cursor-pointer rounded-md disabled:bg-red-400 disabled:cursor-not-allowed"
                      onClick={() => void deletePost(p.id)}
                      disabled={isFormOpen}
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default Posts
