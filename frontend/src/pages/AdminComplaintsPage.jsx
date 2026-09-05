import { useEffect, useState } from 'react'
import api from '../services/api'

function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [reviewingId, setReviewingId] = useState(null)

  useEffect(() => {
    const load = async () => {
      const response = await api.get('/complaints/')
      setComplaints(response.data.data || [])
    }
    load()
  }, [])

  const verifyComplaint = async (complaintId) => {
    setReviewingId(complaintId)
    try {
      const response = await api.put(`/complaints/${complaintId}/verify`)
      const updatedComplaint = response.data.data
      setComplaints((current) => current.map((complaint) => (
        complaint.id === complaintId ? { ...complaint, ...updatedComplaint } : complaint
      )))
    } finally {
      setReviewingId(null)
    }
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Complaint management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b border-slate-200 text-sm text-slate-500">
              <th className="py-3 pr-4">ID</th>
              <th className="py-3 pr-4">Citizen</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Priority</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id} className="border-b border-slate-100">
                <td className="py-3 pr-4">{complaint.complaint_code}</td>
                <td className="py-3 pr-4">{complaint.user?.name}</td>
                <td className="py-3 pr-4">{complaint.category}</td>
                <td className="py-3 pr-4">{complaint.priority}</td>
                <td className="py-3 pr-4">{complaint.status}</td>
                <td className="py-3 pr-4">
                  {complaint.status === 'SUBMITTED' ? (
                    <button
                      onClick={() => verifyComplaint(complaint.id)}
                      disabled={reviewingId === complaint.id}
                      className="rounded-lg bg-primary px-3 py-1.5 text-white text-sm disabled:opacity-60"
                    >
                      {reviewingId === complaint.id ? 'Verifying...' : 'Verify'}
                    </button>
                  ) : (
                    <span className="text-sm text-slate-500">Reviewed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminComplaintsPage
