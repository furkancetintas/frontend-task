import React from 'react'
import { motion } from 'framer-motion'

const About: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <motion.h1
        className="text-2xl md:text-3xl font-extrabold text-gray-800 mb-6"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        📌 Proje Hakkında
      </motion.h1>

      <motion.p
        className="text-lg text-gray-600 max-w-2xl text-center mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        Bu proje, Da Vinci Board Game şirketinin işe alım sürecinde benden talep edilen bir frontend
        geliştirme ödevi kapsamında hazırlandı. Modern teknolojileri kullanarak şık, hızlı ve
        kullanıcı dostu bir uygulama geliştirmeyi hedefledim. Proje; React + TypeScript tabanlıdır
        ve Vite, TailwindCSS, React Router, Sonner (bildirim mesajları), Framer Motion (animasyon),
        Lucide React (ikon) gibi teknolojilerle desteklenmiştir. Uygulamada kullanıcı yönetimi,
        gönderi listesi, arama ve localStorage ile veri kalıcılığı gibi işlevler bulunmaktadır. Bu
        süreç, hem teknik hem de tasarım anlamında bana önemli katkılar sağladı.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl w-full">
        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">⚡ Özellikler</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Kullanıcıları listeleme, ekleme, düzenleme ve silme.</li>
            <li>Gönderileri listeleme, ekleme, düzenleme ve silme.</li>
            <li>
              LocalStorage desteği <br />
              <span className="text-red-500">
                Tüm kullanıcılar ya da gönderiler silindiğinde JSONPlaceholder API'ya istek atılarak
                tüm kullanıcı ve gönderiler tekrardan listelenmesi sağlanmaktadır.
              </span>
            </li>
            <li>React Router ile sayfa geçişleri.</li>
          </ul>
        </motion.div>

        <motion.div
          className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <h2 className="text-xl font-bold text-gray-800 mb-3">🛠️ Kullanılan Teknolojiler</h2>
          <div className="flex flex-wrap gap-2">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              React + Vite + TypeScript + ESLint
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
              TailwindCSS
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
              React Router
            </span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Sonner
            </span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
              Framer Motion
            </span>
            <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
              LocalStorage
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default About
