import { useState } from 'react'
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import api from '../services/api'

const issueCategories = ['Pothole', 'Garbage', 'Streetlight', 'Water Leakage', 'Drainage', 'Road Damage', 'Fallen Tree', 'Infrastructure', 'Other']

const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

function MapPicker({ position, setPosition }) {
  useMapEvents({
    click(event) {
      setPosition([event.latlng.lat, event.latlng.lng])
    },
  })
  return position ? <Marker position={position} icon={markerIcon} /> : null
}

function ReportIssuePage() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Pothole',
    address: '',
    latitude: 28.6139,
    longitude: 77.2090,
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [priorityResult, setPriorityResult] = useState(null)
  const [duplicateResult, setDuplicateResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const setPosition = (coords) => {
    setForm((prev) => ({ ...prev, latitude: coords[0], longitude: coords[1] }))
  }

  const useCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords
      setForm((prev) => ({ ...prev, latitude, longitude }))
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImage(file)
      setImagePreview(URL.createObjectURL(file))
      const reader = new FileReader()
      reader.onload = () => {
        const payload = { description: form.description || form.title || 'damaged road', category: form.category }
        api.post('/ai/classify', payload).then((res) => setAiResult(res.data.data)).catch(() => setAiResult({ category: form.category, confidence: 0.72 }))
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeIssue = async () => {
    try {
      const classifyResponse = await api.post('/ai/classify', { description: form.description, category: form.category })
      setAiResult(classifyResponse.data.data)
      const priorityResponse = await api.post('/ai/priority', { category: classifyResponse.data.data.category, description: form.description, location: { name: form.address || 'Main road' }, similar_count: 2 })
      setPriorityResult(priorityResponse.data.data)
      const duplicateResponse = await api.post('/ai/duplicate', { category: classifyResponse.data.data.category, description: form.description, location: { latitude: form.latitude, longitude: form.longitude } })
      setDuplicateResult(duplicateResponse.data.data)
    } catch (err) {
      setError('AI analysis failed. You can still submit the complaint.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('category', aiResult?.category || form.category)
      formData.append('address', form.address)
      formData.append('latitude', form.latitude)
      formData.append('longitude', form.longitude)
      if (image) formData.append('image', image)

      const response = await api.post('/complaints/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (!response.data.success) throw new Error(response.data.message)
      alert(`Complaint submitted successfully! ID: ${response.data.data.complaint_code}`)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to create complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200 space-y-5">
        <div>
          <h2 className="text-2xl font-bold">Report civic issue</h2>
          <p className="text-slate-600">Share the details and location so authorities can respond quickly.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Issue title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" required />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" rows="4" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Category</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5">
              {issueCategories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Image upload</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Latitude</label>
            <input value={form.latitude} onChange={(e) => setForm({ ...form, latitude: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">Longitude</label>
            <input value={form.longitude} onChange={(e) => setForm({ ...form, longitude: Number(e.target.value) })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </div>
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full rounded-xl border border-slate-200 px-3 py-2.5" />
          </div>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={useCurrentLocation} className="rounded-xl border border-primary bg-teal-50 px-4 py-2 font-medium text-primary">Use My Current Location</button>
          <button type="button" onClick={analyzeIssue} className="rounded-xl bg-slate-900 px-4 py-2 font-medium text-white">Analyze with AI</button>
        </div>

        {imagePreview && <img src={imagePreview} alt="Preview" className="h-48 w-full rounded-2xl object-cover border border-slate-200" />}
        {aiResult && (
          <div className="rounded-xl bg-teal-50 p-4 text-sm text-teal-900">
            <div>AI detected: <strong>{aiResult.category}</strong></div>
            <div>Confidence: {(aiResult.confidence * 100).toFixed(0)}%</div>
          </div>
        )}
        {priorityResult && (
          <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Predicted priority: <strong>{priorityResult.priority}</strong> — {priorityResult.reason}
          </div>
        )}
        {duplicateResult && duplicateResult.duplicate && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
            “A similar issue has already been reported nearby.” Existing complaint: {duplicateResult.complaint_id} | Distance: {duplicateResult.distance_km} km | Status: {duplicateResult.status}
          </div>
        )}

        {error && <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <button disabled={loading} type="submit" className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white disabled:opacity-60">{loading ? 'Submitting...' : 'Submit Complaint'}</button>
      </form>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="text-xl font-bold mb-4">Location preview</h3>
        <MapContainer center={[form.latitude, form.longitude]} zoom={13} scrollWheelZoom>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          <MapPicker position={[form.latitude, form.longitude]} setPosition={setPosition} />
        </MapContainer>
      </div>
    </div>
  )
}

export default ReportIssuePage
