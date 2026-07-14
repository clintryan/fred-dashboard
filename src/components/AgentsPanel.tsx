import { AGENT_SESSIONS, TAG_LABELS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

const TAG_COLORS: Record<string, string> = {
  fluentrx: '#00D4FF', coder: '#A78BFA', teacher: '#10B981', trader: '#F59E0B', fred: '#64748B'
}

export function AgentsPanel() {
  const active = AGENT_SESSIONS.filter(a => a.status === 'active')

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Active Agents</CardTitle>
        <CardMeta>{active.length ? `${active.length} running` : 'none dispatched'}</CardMeta>
      </CardHeader>
      <CardContent>
        {AGENT_SESSIONS.length === 0 ? (
          <div className="text-[11px] italic py-2" style={{ color: '#64748B' }}>
            No active sessions — Fred dispatches agents from here.
          </div>
        ) : (
          AGENT_SESSIONS.map((a, i) => {
            const color = TAG_COLORS[a.tag] || '#64748B'
            const dotColor = a.status === 'active' ? '#10B981' : a.status === 'blocked' ? '#F43F5E' : '#64748B'
            const statusLabel = a.status === 'active' ? '🔄 In progress' : a.status === 'done' ? '✅ Done' : '⏸️ Blocked'
            return (
              <div
                key={i}
                className="rounded-lg px-3.5 py-3 mb-2.5"
                style={{ background: '#1A2238', border: '1px solid #263350' }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: dotColor, boxShadow: a.status === 'active' ? `0 0 4px ${dotColor}` : 'none' }}
                    />
                    <span
                      className="text-[11px] font-semibold"
                      style={{ fontFamily: "'Space Mono', monospace", color: dotColor }}
                    >
                      {statusLabel}
                    </span>
                  </div>
                  <span className="text-[10px]" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
                    {a.since}
                  </span>
                </div>
                <div className="text-[12px] mb-1.5" style={{ color: '#E2E8F0' }}>{a.task}</div>
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                  style={{ background: `${color}1a`, color }}
                >
                  {TAG_LABELS[a.tag] || a.tag}
                </span>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
