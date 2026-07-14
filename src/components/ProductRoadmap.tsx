import { ROADMAP } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

const STATUS_COLOR: Record<string, string> = {
  active:  '#0A5CFF',
  queued:  '#F59E0B',
  planned: '#64748B',
  vision:  '#8B5CF6',
}
const STATUS_LABEL: Record<string, string> = {
  active:  'ACTIVE',
  queued:  'QUEUED',
  planned: 'PLANNED',
  vision:  'VISION',
}

export function ProductRoadmap() {
  const phases = ROADMAP.length

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Roadmap</CardTitle>
        <CardMeta>{phases} phases · AI teacher platform</CardMeta>
      </CardHeader>
      <CardContent>
        {ROADMAP.map((item, i) => {
          const sc = STATUS_COLOR[item.status] || '#64748B'
          const sl = STATUS_LABEL[item.status] || item.status.toUpperCase()
          return (
            <div
              key={i}
              className="py-3.5 flex gap-4 items-start border-b last:border-0"
              style={{ borderColor: '#1E2D45' }}
            >
              <div className="flex-shrink-0 w-12 text-center">
                <div
                  className="text-[11px] font-bold px-1.5 py-1 rounded"
                  style={{
                    fontFamily: "'Space Mono', monospace",
                    color: sc,
                    background: `${sc}22`,
                    letterSpacing: '0.05em',
                  }}
                >
                  P{item.phase}
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-[13px] font-semibold" style={{ color: '#E2E8F0' }}>{item.title}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{ color: sc, background: `${sc}22` }}
                  >
                    {sl}
                  </span>
                  <span className="text-[9px] font-semibold" style={{ color: '#64748B' }}>{item.target}</span>
                  {item.branch && (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-sm"
                      style={{
                        fontFamily: "'Space Mono', monospace",
                        color: '#64748B',
                        background: '#1A2238',
                      }}
                    >
                      {item.branch}
                    </span>
                  )}
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: '#64748B' }}>
                  {item.description}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
