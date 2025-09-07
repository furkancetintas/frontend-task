import React, { useState, type FormEvent } from 'react'
import type { Post, User } from '../../types'
import { toast } from 'sonner'

type PostFormProps = {
  initial?: Partial<Post>
  users: User[]
  onUpdate: (data: Post) => void
  onCreate: (data: Omit<Post, 'id'>) => void
  onCancel: () => void
}

const PostForm: React.FC<PostFormProps> = ({ initial, users, onUpdate, onCreate, onCancel }) => {
  const [userId, setUserId] = useState<number>(initial?.userId ?? users[0]?.id ?? 1)
  const [title, setTitle] = useState<string>(initial?.title ?? '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (initial?.id) {
      const payload: Post = {
        id: initial.id,
        userId,
        title,
      }
      onUpdate(payload)
      toast.success(`@${title} adında gönderi düzenlendi.`)
    } else {
      const payload: Omit<Post, 'id'> = {
        userId,
        title,
      }
      onCreate(payload)
      toast.success(`@${title} adında gönderi eklendi.`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded-xl shadow-md flex flex-col gap-3 mt-10"
    >
      <h2 className="text-xl font-semibold mb-2">
        {initial?.id ? 'Gönderi Düzenle' : 'Gönderi Ekle'}
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Gönderiyi Oluşturan Kullanıcı</label>
        <select
          value={userId}
          onChange={(e) => setUserId(Number(e.target.value))}
          required
          className="border rounded-lg p-2 w-full"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} (username:@{user.username}) (userId: {user.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Başlık</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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

export default PostForm
