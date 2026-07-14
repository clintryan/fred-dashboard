import { FRIDAY_FIX_LOG } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

const STATUS_COLOR: Record<string, string> = { done: '#10B981', pending: '#F59E0B', blocked: '#F43F5E' }
const TYPE_COLOR:   Record<string, string> = { decision: '#A78BFA', task: '#00D4FF', idea: '#F59E0B' }

export function FridayFixLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Friday Fix — Work Log</CardTitle>
        <CardMeta>decisions · tasks · ideas</CardMeta>
      </CardHeader>
      <CardContent>
        {FRIDAY_FIX_LOG.map((entry, i) => {
          const sc = STATUS_COLOR[entry.status] || '#64748B'
          const tc = TYPE_COLOR[entry.type] || '#64748B'
          return (
            <div
              key={i}
              className="py-3 flex gap-4 items-start border-b last:border-0"
              style={{ borderColor: '#1E2D45' }}
            >
              <div
                className="flex-shrink-0 w-20 text-[10px] pt-0.5"
                style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}
              >
                {entry.date}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{ color: tc, background: `${tc}22` }}
                  >
                    {entry.type}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{ color: sc, background: `${sc}22` }}
                  >
                    {entry.status}
                  </span>
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: '#E2E8F0' }}>
                  {entry.text}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
