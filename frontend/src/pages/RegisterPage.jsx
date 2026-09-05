import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../services/api'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  confirm_password: '',
  role: 'citizen',
}

function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await api.post('/auth/register', form)
      const payload = response.data
      if (!payload.success) throw new Error(payload.message)
      localStorage.setItem('token', payload.data.token)
      localStorage.setItem('user', JSON.stringify(payload.data.user))
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-xl rounded-3xl bg-white p-8 shadow-soft">
        <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
        <p className="mt-2 text-slate-600">Join CivicConnect AI</p>
        {error && <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Full Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Confirm Password</label>
            <input type="password" value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5">
              <option value="citizen">Citizen</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button disabled={loading} className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
        <p className="mt-5 text-sm text-slate-600">Already have an account? <Link to="/login" className="font-semibold text-primary">Login</Link></p>
      </div>
    </div>
  )
}

export default RegisterPage
