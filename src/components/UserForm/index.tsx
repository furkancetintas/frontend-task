import React, { useState, type FormEvent } from 'react'
import type { User } from '../../types'
import { toast } from 'sonner'

type UserFormProps = {
  initial?: Partial<User>
  onUpdate: (data: User) => void
  onCreate: (data: Omit<User, 'id'>) => void
  onCancel: () => void
}

const UserForm: React.FC<UserFormProps> = ({ initial, onUpdate, onCreate, onCancel }) => {
  const [name, setName] = useState<string>(initial?.name ?? '')
  const [username, setUsername] = useState<string>(initial?.username ?? '')
  const [email, setEmail] = useState<string>(initial?.email ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (initial?.id) {
      const payload: User = {
        id: initial.id,
        name,
        username,
        email,
      }
      onUpdate(payload)
      console.log('Calling onUpdate with:', payload)
      toast.success(`@${username} adında kullanıcı düzenlendi.`)
    } else {
      const payload: Omit<User, 'id'> = {
        name,
        username,
        email,
      }
      onCreate(payload)
      toast.success(`@${username} adında kullanıcı eklendi.`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3 mt-10"
    >
      <h2 className="text-xl font-semibold mb-2">
        {initial?.id ? 'Kullanıcı Düzenle' : 'Kullanıcı Ekle'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Ad Soyad</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Kullanıcı Adı</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">E-Posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded-lg p-2 w-full"
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer px-4 py-2 transition-all bg-gray-300 rounded-lg hover:bg-gray-400"
        >
          İptal et
        </button>
        <button
          type="submit"
          className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
        >
          {initial?.id ? 'Düzenle' : 'Ekle'}
        </button>
      </div>
    </form>
  )
}

export default UserForm
