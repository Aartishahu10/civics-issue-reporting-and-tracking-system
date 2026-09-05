import { useState } from 'react'
import api from '../services/api'

function AssistantPage() {
  const [question, setQuestion] = useState('How do I report a pothole?')
  const [reply, setReply] = useState('')

  const handleAsk = async () => {
    const response = await api.post('/ai/chat', { question })
    setReply(response.data.data.reply)
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold">CivicAssist</h2>
      <div className="mt-6 flex gap-3">
        <input value={question} onChange={(e) => setQuestion(e.target.value)} className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5" />
        <button onClick={handleAsk} className="rounded-xl bg-primary px-4 py-2 text-white">Ask</button>
      </div>
      <div className="mt-6 rounded-xl bg-slate-50 p-4 text-slate-700">{reply || 'CivicAssist can answer questions about reporting, tracking, and civic issue status.'}</div>
    </div>
  )
}

export default AssistantPage
