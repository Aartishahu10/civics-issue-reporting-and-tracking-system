import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/login', form)
      const payload = response.data
      if (!payload.success) throw new Error(payload.message)
      localStorage.setItem('token', payload.data.token)
      localStorage.setItem('user', JSON.stringify(payload.data.user))
      const role = payload.data.user.role
      navigate(role === 'admin' ? '/admin' : role === 'staff' ? '/staff' : '/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
        <p className="mt-2 text-slate-600">Sign in to CivicConnect AI</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <button disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Logging in...' : 'Login'}</button>
        </form>
        <p className="mt-5 text-sm text-slate-600">No account yet? <Link to="/register" className="font-semibold text-primary">Register</Link></p>
        <div className="mt-6 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
          Demo credentials: admin@civicconnect.ai / Admin@123
        </div>
      </div>
    </div>
  )
}

export default LoginPage
