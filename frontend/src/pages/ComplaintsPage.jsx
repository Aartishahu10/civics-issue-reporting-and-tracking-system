import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

function ComplaintsPage() {
  const [complaints, setComplaints] = useState([])

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/complaints/')
      setComplaints(response.data.data || [])
    }
    load()
  }, [])

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6">My complaints</h2>
      <div className="space-y-3">
        {complaints.map((complaint) => (
          <Link key={complaint.id} to={`/complaints/${complaint.id}`} className="block rounded-2xl border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{complaint.complaint_code}</div>
                <div className="text-sm text-slate-500">{complaint.title}</div>
              </div>
              <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-primary">{complaint.status}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
              <span>{complaint.category}</span>
              <span>{complaint.priority}</span>
              <span>{complaint.address}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ComplaintsPage
