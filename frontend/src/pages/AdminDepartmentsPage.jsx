import { useEffect, useState } from 'react'
import api from '../services/api'

function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState([])

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/admin/departments')
      setDepartments(response.data.data || [])
    }
    load()
  }, [])

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Departments</h2>
      <div className="space-y-3">{departments.map((department) => <div key={department.id} className="rounded-xl border border-slate-200 p-3"><div className="font-semibold">{department.name}</div><div className="text-sm text-slate-500">{department.description}</div></div>)}</div>
    </div>
  )
}

export default AdminDepartmentsPage
