import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { MapContainer, Marker, TileLayer } from 'react-leaflet'
import api from '../services/api'

function ComplaintDetailsPage() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)

  useEffect(() => {
    const load = async () => {
      const response = await api.get(`/complaints/${id}`)
      setComplaint(response.data.data)
    }
    load()
  }, [id])

  if (!complaint) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-500">Complaint ID</div>
            <h2 className="text-2xl font-bold">{complaint.complaint_code}</h2>
          </div>
          <span className="rounded-full bg-primary px-3 py-2 text-sm font-semibold text-white">{complaint.status}</span>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Title</h3>
            <p>{complaint.title}</p>
            <h3 className="mt-4 font-semibold">Description</h3>
            <p className="text-slate-600">{complaint.description}</p>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <div><strong>Category:</strong> {complaint.category}</div>
            <div><strong>Priority:</strong> {complaint.priority}</div>
            <div><strong>Location:</strong> {complaint.address}</div>
            <div><strong>Date:</strong> {new Date(complaint.created_at).toLocaleString()}</div>
            <div><strong>Department:</strong> {complaint.department?.name || 'Unassigned'}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Complaint map</h3>
          <MapContainer center={[complaint.latitude, complaint.longitude]} zoom={13} scrollWheelZoom>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
            <Marker position={[complaint.latitude, complaint.longitude]} />
          </MapContainer>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <h3 className="text-xl font-bold mb-4">Timeline</h3>
          <div className="space-y-3">
            <div className="rounded-xl bg-slate-50 p-3">Submitted</div>
            <div className="rounded-xl bg-slate-50 p-3">Verified</div>
            <div className="rounded-xl bg-slate-50 p-3">Assigned</div>
            <div className="rounded-xl bg-slate-50 p-3">In Progress</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetailsPage
