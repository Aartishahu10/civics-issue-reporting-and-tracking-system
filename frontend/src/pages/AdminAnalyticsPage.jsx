import { BarChart, Bar, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const data = [
  { name: 'Pothole', value: 8 },
  { name: 'Garbage', value: 5 },
  { name: 'Water', value: 4 },
  { name: 'Streetlight', value: 3 },
]

function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {['Total Complaints', 'Pending', 'Resolved', 'Critical Issues'].map((label, index) => (
          <div key={label} className="rounded-2xl bg-white p-5 border border-slate-200 shadow-sm">
            <div className="text-sm text-slate-500">{label}</div>
            <div className="mt-2 text-3xl font-bold">{[20, 7, 9, 5][index]}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-2xl font-bold mb-4">Complaints by category</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0f766e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default AdminAnalyticsPage
