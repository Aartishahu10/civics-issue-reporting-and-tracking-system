import { Link } from 'react-router-dom'

function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {['Total Complaints', 'Verified', 'Critical Issues'].map((label) => (
          <div key={label} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{label === 'Total Complaints' ? 20 : label === 'Verified' ? 8 : 5}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Admin actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/complaints" className="rounded-xl bg-primary px-4 py-2 text-white">Manage complaints</Link>
          <Link to="/admin/users" className="rounded-xl border border-slate-200 px-4 py-2">Users</Link>
          <Link to="/admin/analytics" className="rounded-xl border border-slate-200 px-4 py-2">Analytics</Link>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
