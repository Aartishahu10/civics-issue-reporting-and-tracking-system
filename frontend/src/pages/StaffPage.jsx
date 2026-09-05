import { Link } from 'react-router-dom'

function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {['Assigned', 'High Priority', 'Completed'].map((label, index) => (
          <div key={label} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{[6, 2, 4][index]}</div>
          </div>
        ))}
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Task overview</h2>
          <Link to="/staff/tasks" className="rounded-xl bg-primary px-4 py-2 text-white">View tasks</Link>
        </div>
      </div>
    </div>
  )
}

export default StaffPage
