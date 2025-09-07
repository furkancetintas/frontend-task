import { useEffect, useMemo, useState } from 'react'
import { usersApi } from '../../services/api'
import type { User } from '../../types'
import UserForm from '../../components/UserForm'
import { toast } from 'sonner'

function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)

  // // ✅ Yeni kullanıcı ekleme
  // const handleAddUser = (data: Omit<User, "id">) => {
  //   const newUser: User = { id: users.length + 1, ...data };
  //   setUsers((prev) => [...prev, newUser]);
  //   setIsFormOpen(false);
  // };

  // // ✅ Kullanıcı düzenleme
  // const handleUpdateUser = (data: User) => {
  //   setUsers((prev) => prev.map((user) => (user.id === data.id ? data : user)));
  // };

  // // ✅ Kullanıcı silme
  // const handleDeleteUser = (id: number) => {
  //   setUsers((prev) => prev.filter((user) => user.id !== id));
  // };

  // ✅ Formu aç/kapat
  const openAddForm = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedUser(null)
    setIsFormOpen(true)
  }

  const openEditForm = (user: User) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setSelectedUser(user)
    setIsFormOpen(true)
  }

  useEffect(() => {
    ;(async () => {
      try {
        const storedUsers = localStorage.getItem('users')
        if (storedUsers && JSON.parse(storedUsers).length > 0) {
          setUsers(JSON.parse(storedUsers))
        } else {
          const data = await usersApi.list()
          setUsers(data)
        }
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return users
    const f = filter.toLowerCase()
    return users.filter((u) =>
      [u.name, u.username, u.email].some((x) => x.toLowerCase().includes(f))
    )
  }, [users, filter])

  async function createUser(data: Omit<User, 'id'>) {
    const tempId = Math.max(0, ...users.map((u) => u.id)) + 1
    const newUser: User = { id: tempId, ...data }
    setUsers((prev) => [...prev, newUser])
    try {
      const created = await usersApi.create(data)
      setUsers((prev) => prev.map((u) => (u.id === tempId ? { ...created, id: tempId } : u)))
      // LocalStorage'ı güncelle
      const updatedUsers = [newUser, ...users]
      localStorage.setItem('users', JSON.stringify(updatedUsers))
    } catch (e) {
      toast.success(`Kullanıcı oluşturma hatası: ${(e as Error).message}`)
    } finally {
      setIsFormOpen(false)
    }
  }

  async function updateUser(data: User) {
    setIsFormOpen(true)
    try {
      const updatedUser = users.map((user) => (user.id === data.id ? data : user))
      setUsers(updatedUser)
      await usersApi.update(data.id, data)
      localStorage.setItem('users', JSON.stringify(updatedUser)) // ✅ doğru liste
    } catch (e) {
      toast.message(`Güncelleme hatası: ${(e as Error).message}`)
    } finally {
      setIsFormOpen(false)
      setSelectedUser(null)
    }
  }

  async function deleteUser(id: number) {
    const keep = users
    const filterUser: User[] = users.filter((user) => user.id !== id)
    setUsers(filterUser)
    try {
      await usersApi.remove(id)
      localStorage.setItem('users', JSON.stringify(filterUser))
    } catch (e) {
      setUsers(keep)
      toast.error(`Silme hatası: ${(e as Error).message}`)
    } finally {
      toast.success('Kullanıcı silindi.')
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
          <h2 className="text-2xl md:text-3xl my-3 font-bold">Kullanıcılar Listesi</h2>
          {filtered.length > 0 && (
            <p className="text-center">
              <strong>{filtered.length}</strong> adet kullanıcı bulundu.
            </p>
          )}
          <div className="flex flex-col md:flex-row justify-center items-center gap-2 mt-2">
            <input
              className="px-2 py-1 border border-slate-300 rounded-md"
              placeholder="Kullanıcılarda ara..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 transition-all text-white rounded-lg cursor-pointer"
              onClick={() => openAddForm()}
            >
              + Kullanıcı ekle
            </button>
          </div>
        </header>
        {/* ✅ Form açık ise formu göster */}
        {isFormOpen && (
          <UserForm
            initial={selectedUser ?? undefined}
            onUpdate={selectedUser ? updateUser : () => {}}
            onCreate={!selectedUser ? createUser : () => {}}
            onCancel={() => {
              setIsFormOpen(false)
              setSelectedUser(null)
            }}
          />
        )}
        {filtered.length === 0 && (
          <div className="flex justify-center mt-16">
            <span className="text-red-600">Kullanıcı bulunamadı!</span>
          </div>
        )}
        {filtered.length > 0 && (
          <table className="table w-full text-xs lg:text-base my-10">
            <thead className="border-b">
              <tr className="text-center">
                <th className="">ID</th>
                <th className="">Name</th>
                <th className="">Username</th>
                <th className="">Email</th>
                <th className="">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.id}
                  className="border-b wrap-break-word border-b-gray-600 mx-4 text-center"
                >
                  <td className="py-3 break-words whitespace-pre-wrap max-w-[70px] sm:max-w-full">
                    <span className="badge">{u.id}</span>
                  </td>
                  <td className="py-3 break-words whitespace-pre-wrap max-w-[70px] sm:max-w-full">
                    {u.name}
                  </td>
                  <td className="py-3 break-words whitespace-pre-wrap max-w-[70px] sm:max-w-full">
                    @{u.username}
                  </td>
                  <td className="py-3 break-words whitespace-pre-wrap max-w-[70px] sm:max-w-full">
                    {u.email}
                  </td>
                  <td className="py-3 break-words whitespace-pre-wrap max-w-[70px] sm:max-w-full">
                    <button
                      className="px-2 py-1 mr-2 bg-amber-200 cursor-pointer rounded-md disabled:bg-amber-100 disabled:cursor-not-allowed"
                      onClick={() => openEditForm(u)}
                      disabled={isFormOpen}
                    >
                      Düzenle
                    </button>
                    <button
                      className="px-2 py-1 mt-2 sm:mt-0 bg-red-500 text-white cursor-pointer rounded-md disabled:bg-red-400 disabled:cursor-not-allowed"
                      onClick={() => void deleteUser(u.id)}
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

export default Users
