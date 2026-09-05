import { useEffect, useState } from 'react'
import { FilePlus2, ListTodo, MapPinned, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../services/api'

const statCards = [
  { label: 'Total Reports', key: 'total' },
  { label: 'Pending', key: 'pending' },
  { label: 'In Progress', key: 'in_progress' },
  { label: 'Resolved', key: 'resolved' },
]

function DashboardPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await api.get('/complaints/')
        const data = response.data.data || []
        setComplaints(data)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const stats = {
    total: complaints.length,
    pending: complaints.filter((item) => ['SUBMITTED', 'VERIFIED', 'ASSIGNED'].includes(item.status)).length,
    in_progress: complaints.filter((item) => item.status === 'IN_PROGRESS').length,
    resolved: complaints.filter((item) => ['RESOLVED', 'CLOSED'].includes(item.status)).length,
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {statCards.map((card) => (
          <div key={card.key} className="rounded-2xl bg-white p-5 shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500">{card.label}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{stats[card.key]}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_0.8fr]">
        <div className="rounded-2xl bg-white p-5 border border-slate-200">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Recent complaints</h3>
            <Link to="/complaints" className="text-sm text-primary font-semibold">View all</Link>
          </div>

          <div className="space-y-3">
            {loading ? <div>Loading...</div> : complaints.slice(0, 5).map((complaint) => (
              <Link key={complaint.id} to={`/complaints/${complaint.id}`} className="block rounded-xl border border-slate-200 p-4 hover:bg-slate-50">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-semibold">{complaint.complaint_code}</div>
                    <div className="text-sm text-slate-500">{complaint.title}</div>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-700">{complaint.priority}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>{complaint.category}</span>
                  <span>{complaint.status}</span>
                  <span>{new Date(complaint.created_at).toLocaleDateString()}</span>
                  <span>{complaint.address}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200">
          <h3 className="text-xl font-bold">Quick actions</h3>
          <div className="mt-5 space-y-3">
            <Link to="/report" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><FilePlus2 size={18} /> Report New Issue</Link>
            <Link to="/complaints" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><ListTodo size={18} /> Track Issue</Link>
            <Link to="/complaints" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><MapPinned size={18} /> View My Reports</Link>
            <Link to="/assistant" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 hover:bg-slate-50"><MessageSquareText size={18} /> Open AI Assistant</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
