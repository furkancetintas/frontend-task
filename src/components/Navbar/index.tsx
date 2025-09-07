import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.header
      className="bg-gray-50 shadow-md w-full z-50"
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-0 py-4">
        <motion.h1
          className="text-xl sm:text-2xl font-extrabold text-gray-800 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Link to={'/'}>frontend-task</Link>
        </motion.h1>

        <nav className="hidden md:flex space-x-6">
          {[
            { name: 'Ana sayfa', path: '/' },
            { name: 'Kullanıcılar', path: '/users' },
            { name: 'Gönderiler', path: '/posts' },
            { name: 'Proje Hakkında', path: '/about' },
          ].map((link, i) => (
            <motion.div
              key={link.name}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
            >
              <NavLink
                to={link.path}
                className={({ isActive }) =>
                  `relative text-base font-medium transition-all duration-300 ${
                    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-500'
                  }`
                }
              >
                {link.name}
                {/* Alt çizgi animasyonu */}
                <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Mobil Menü Butonu */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-blue-600 transition cursor-pointer"
          >
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobil Menü */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-gray-50 border-t shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col px-6 py-4 space-y-4">
            {[
              { name: 'Ana sayfa', path: '/' },
              { name: 'Kullanıcılar', path: '/users' },
              { name: 'Gönderiler', path: '/posts' },
              { name: 'Proje Hakkında', path: '/about' },
            ].map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `text-lg font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-500'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  )
}

export default Navbar
