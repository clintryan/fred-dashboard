import { BUILD_LOG, TAG_LABELS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

const TYPE_COLORS: Record<string, string> = {
  automation: '#00D4FF',
  feature:    '#A78BFA',
  infra:      '#F59E0B',
  fix:        '#F43F5E',
  ops:        '#10B981',
}

export function BuildLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Build Log</CardTitle>
        <CardMeta>shipped · build in public</CardMeta>
      </CardHeader>
      <CardContent>
        {BUILD_LOG.map((entry, i) => {
          const color = TYPE_COLORS[entry.type] || '#64748B'
          const tagColor = { fluentrx: '#00D4FF', coder: '#A78BFA', teacher: '#10B981', trader: '#F59E0B', fred: '#64748B' }[entry.tag] || '#64748B'
          return (
            <div
              key={i}
              className="py-3.5 flex gap-4 items-start border-b last:border-0"
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
                  <span className="text-[13px] font-semibold" style={{ color: '#E2E8F0' }}>{entry.title}</span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{ color, background: `${color}22` }}
                  >
                    {entry.type}
                  </span>
                  <span
                    className="text-[9px] font-semibold uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-sm"
                    style={{ color: tagColor, background: `${tagColor}1a` }}
                  >
                    {TAG_LABELS[entry.tag] || entry.tag}
                  </span>
                </div>
                <div className="text-[12px] leading-[1.6]" style={{ color: '#64748B' }}>
                  {entry.description}
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
