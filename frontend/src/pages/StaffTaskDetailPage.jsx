import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function StaffTaskDetailPage() {
  const { id } = useParams()
  const [task, setTask] = useState(null)

  useEffect(() => {
    const load = async () => {
      const response = await api.get(`/complaints/${id}`)
      setTask(response.data.data)
    }
    load()
  }, [id])

  if (!task) return <div>Loading...</div>

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold">{task.complaint_code}</h2>
      <p className="mt-2 text-slate-600">{task.title}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl bg-slate-50 p-4"><strong>Category:</strong> {task.category}</div>
        <div className="rounded-xl bg-slate-50 p-4"><strong>Priority:</strong> {task.priority}</div>
        <div className="rounded-xl bg-slate-50 p-4"><strong>Location:</strong> {task.address}</div>
        <div className="rounded-xl bg-slate-50 p-4"><strong>Status:</strong> {task.status}</div>
      </div>
      <div className="mt-6 flex gap-3">
        <button className="rounded-xl bg-primary px-4 py-2 text-white">Accept Task</button>
        <button className="rounded-xl border border-slate-200 px-4 py-2">Start Work</button>
        <button className="rounded-xl border border-slate-200 px-4 py-2">Mark Resolved</button>
      </div>
    </div>
  )
}

export default StaffTaskDetailPage
