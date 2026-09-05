import { Outlet, Link, useNavigate } from 'react-router-dom'

function AuthLayout() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const navItems = {
    citizen: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Report Issue', to: '/report' },
      { label: 'Complaints', to: '/complaints' },
      { label: 'Map', to: '/map' },
      { label: 'Assistant', to: '/assistant' },
    ],
    admin: [
      { label: 'Admin', to: '/admin' },
      { label: 'Complaints', to: '/admin/complaints' },
      { label: 'Users', to: '/admin/users' },
      { label: 'Departments', to: '/admin/departments' },
      { label: 'Analytics', to: '/admin/analytics' },
    ],
    staff: [
      { label: 'Staff', to: '/staff' },
      { label: 'Tasks', to: '/staff/tasks' },
    ],
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">C</div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">CivicConnect AI</h1>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {(navItems[user?.role] || []).map((item) => (
              <Link key={item.to} to={item.to} className="text-slate-600 hover:text-primary">{item.label}</Link>
            ))}
          </nav>
          <button onClick={handleLogout} className="bg-slate-900 text-white px-4 py-2 rounded-lg">Logout</button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

export default AuthLayout
