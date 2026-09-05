import { useEffect, useState } from 'react'
import api from '../services/api'

function AdminUsersPage() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/admin/users')
      setUsers(response.data.data || [])
    }
    load()
  }, [])

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Users</h2>
      <div className="space-y-3">{users.map((user) => <div key={user.id} className="flex justify-between rounded-xl border border-slate-200 p-3"><span>{user.name}</span><span className="text-slate-500">{user.role}</span></div>)}</div>
    </div>
  )
}

export default AdminUsersPage
