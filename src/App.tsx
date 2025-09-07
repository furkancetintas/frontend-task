import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Routes } from 'react-router'
import Home from './pages/Homepage' // <-- Homepage bileşenini ekliyoruz
import Users from './pages/Users' // <-- Users bileşenini ekliyoruz
import Posts from './pages/Posts'
import Navbar from './components/Navbar'
import { Toaster } from 'sonner'
import About from './pages/About'
import Footer from './components/Footer'

const App: React.FC = () => {
  return (
    <Router>
      <Toaster />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<Users />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/about" element={<About />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
