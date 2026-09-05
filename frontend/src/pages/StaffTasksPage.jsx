import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function StaffTasksPage() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/staff/tasks')
      setTasks(response.data.data || [])
    }
    load()
  }, [])

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Assigned tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <Link key={task.id} to={`/staff/tasks/${task.id}`} className="block rounded-2xl border border-slate-200 p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{task.complaint_code}</div>
                <div className="text-sm text-slate-500">{task.title}</div>
              </div>
              <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">{task.priority}</span>
            </div>
            <div className="mt-3 text-sm text-slate-500">{task.category} • {task.status}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default StaffTasksPage
