import { SOCIAL_QUEUE, TAG_LABELS } from '@/data/static'
import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'

const TAG_COLORS: Record<string, string> = {
  fluentrx: '#00D4FF', coder: '#A78BFA', teacher: '#10B981', trader: '#F59E0B', fred: '#64748B'
}

export function SocialQueue() {
  const drafts = SOCIAL_QUEUE.filter(p => p.status === 'draft')

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Social Queue</CardTitle>
        <CardMeta>{drafts.length ? `${drafts.length} ready to post` : 'all clear'}</CardMeta>
      </CardHeader>
      <CardContent>
        {SOCIAL_QUEUE.length === 0 ? (
          <div className="text-[11px] italic py-2" style={{ color: '#64748B' }}>
            No drafts yet — domain agents write here at session closeout.
          </div>
        ) : (
          SOCIAL_QUEUE.map((p, i) => {
            const color = TAG_COLORS[p.tag] || '#64748B'
            const isPosted = p.status === 'posted'
            return (
              <div
                key={i}
                className="rounded-lg px-3.5 py-3 mb-2.5"
                style={{ background: '#1A2238', border: '1px solid #263350' }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[10px] font-bold"
                    style={{ fontFamily: "'Space Mono', monospace", color: '#00D4FF' }}
                  >
                    {p.persona}
                  </span>
                  <span className="text-[10px]" style={{ fontFamily: "'Space Mono', monospace", color: '#64748B' }}>
                    {p.date}
                  </span>
                </div>
                <div
                  className="text-[12px] leading-[1.55] italic mb-2 pl-2.5 border-l-2"
                  style={{ color: '#E2E8F0', borderColor: '#263350', whiteSpace: 'pre-wrap' }}
                >
                  {p.draft}
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{
                      background: isPosted ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                      color: isPosted ? '#10B981' : '#F59E0B',
                    }}
                  >
                    {isPosted ? '✅ Posted' : '📝 Draft'}
                  </span>
                  <span
                    className="text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-sm"
                    style={{ background: `${color}1a`, color }}
                  >
                    {TAG_LABELS[p.tag] || p.tag}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}
