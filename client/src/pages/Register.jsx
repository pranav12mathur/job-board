import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Register() {
    const { register } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const submit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)
        try {
            await register(form.name, form.email, form.password)
            navigate('/')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Create account</h1>
                <p className="text-gray-500 text-sm mb-6">Start finding your next job today</p>

                {error && <p className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-4">{error}</p>}

                <form onSubmit={submit} className="flex flex-col gap-4">
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Name</label>
                        <input name="name" value={form.name} onChange={handle} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Email</label>
                        <input name="email" type="email" value={form.email} onChange={handle} required
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 mb-1 block">Password</label>
                        <input name="password" type="password" value={form.password} onChange={handle} required minLength={6}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
                    </div>
                    <button type="submit" disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-sm text-gray-500 text-center mt-6">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    )
}