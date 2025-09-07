import { motion } from 'framer-motion'
import { Github, Linkedin, Instagram, Globe } from 'lucide-react'

const Footer: React.FC = () => {
  return (
    <motion.footer
      className="shadow-md w-full text-black px-4 pb-6 md:pt-6"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 md:px-0">
        {/* Sol taraf */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-sm"
        >
          <span>© {new Date().getFullYear()} Furkan Enes Çetintaş — Tüm Hakları Saklıdır.</span>
        </motion.div>

        {/* Orta Kısım - Sosyal Medya */}
        <motion.div
          className="flex space-x-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <a
            href="https://github.com/furkancetintas"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            <Github size={22} />
          </a>
          <a
            href="https://www.linkedin.com/in/furkancetintas"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            <Linkedin size={22} />
          </a>
          <a
            href="https://instagram.com/furkancetintas6"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            <Instagram size={22} />
          </a>
          <a
            href="https://furkancetintas.netlify.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 transition-colors duration-300"
          >
            <Globe size={22} />
          </a>
        </motion.div>
      </div>
    </motion.footer>
  )
}

export default Footer
