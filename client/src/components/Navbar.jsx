import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
            <Link to="/" className="text-xl font-bold text-blue-600">JobBoard</Link>
            <div className="flex items-center gap-4">
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm">Find Jobs</Link>
                {user ? (
                    <>
                        <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm">Dashboard</Link>
                        {user.role === 'admin' && (
                            <Link to="/admin" className="text-gray-600 hover:text-blue-600 text-sm">Admin</Link>
                        )}
                        <span className="text-sm text-gray-500">Hi, {user.name}</span>
                        <button
                            onClick={handleLogout}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 text-sm">Login</Link>
                        <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}