'use client'
import { useEffect, useState } from 'react'

type Row = { member: string; score: number }

export default function Leaderboard() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const run = async () => {
    try {
      const r = await fetch('/api/leaderboard?game=hyperrun&limit=10', { cache: 'no-store' })
      if (!r.ok) throw new Error('bad response ' + r.status)
      const text = await r.text()
      const j = JSON.parse(text)
      setRows(j.rows || [])
    } catch (err) {
      console.error('leaderboard fetch failed', err)
      setRows([])
    } finally {
      setLoading(false)
    }
  }
  run()
}, [])


  const short = (s: string) => s.length > 10 ? s.slice(0,6) + '...' + s.slice(-2) : s

  if (loading) return <div className="text-white/80 text-sm">loading…</div>
  if (!rows.length) return <div className="text-white/80 text-sm">no scores yet</div>

  return (
    <div className="w-full max-w-xs mx-auto mt-4 rounded-2xl bg-black/40 backdrop-blur p-3 border border-white/10 text-white">
      <div className="text-sm mb-2">top 10</div>
      <ol className="m-0 p-0 list-decimal list-inside space-y-1">
        {rows.map((r, i) => (
          <li key={r.member + i} className="flex justify-between text-sm">
            <span className="truncate">{short(r.member)}</span>
            <strong>{r.score}</strong>
          </li>
        ))}
      </ol>
    </div>
  )
}
