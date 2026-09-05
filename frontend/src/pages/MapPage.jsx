import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

const sampleComplaints = [
  { id: 'CIV-2026-00001', category: 'Pothole', priority: 'CRITICAL', status: 'VERIFIED', position: [28.6139, 77.2090] },
  { id: 'CIV-2026-00002', category: 'Garbage', priority: 'HIGH', status: 'ASSIGNED', position: [28.6238, 77.2152] },
  { id: 'CIV-2026-00003', category: 'Streetlight', priority: 'MEDIUM', status: 'IN_PROGRESS', position: [28.6180, 77.2300] },
]

const colorMap = {
  LOW: 'green',
  MEDIUM: 'yellow',
  HIGH: 'orange',
  CRITICAL: 'red',
}

function MapPage() {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-4">Civic issue map</h2>
      <MapContainer center={[28.6139, 77.2090]} zoom={12} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
        {sampleComplaints.map((complaint) => (
          <Marker key={complaint.id} position={complaint.position}>
            <Popup>
              <strong>{complaint.id}</strong><br />
              {complaint.category}<br />
              Priority: {complaint.priority}<br />
              Status: {complaint.status}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

export default MapPage
