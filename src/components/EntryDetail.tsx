import { Card, CardHeader, CardTitle, CardMeta, CardContent } from '@/components/ui/card'
import type { JournalEntry } from '@/data/types'

interface EntryDetailProps {
  entry: JournalEntry
  onClose: () => void
}

const STATUS_COLORS: Record<string, string> = {
  done: '#10B981',
  partial: '#F59E0B',
  pending: '#64748B',
  blocked: '#F43F5E',
}

export function EntryDetail({ entry, onClose }: EntryDetailProps) {
  const statusColor = STATUS_COLORS[entry.status] || '#64748B'

  // Format timestamp
  const ts = new Date(entry.ts)
  const formattedDate = ts.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black bg-opacity-50"
      onClick={onClose}
      style={{ paddingTop: '60px', paddingBottom: '60px' }}
    >
      <Card
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full mx-4"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle>{entry.project}</CardTitle>
              <CardMeta>
                {entry.persona} · {formattedDate}
              </CardMeta>
            </div>
            <button
              onClick={onClose}
              className="text-2xl leading-none"
              style={{ color: '#64748B' }}
              aria-label="Close"
            >
              ×
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span
              className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-1 rounded-sm"
              style={{ color: statusColor, background: `${statusColor}22` }}
            >
              {entry.status}
            </span>
            {entry.run_id && (
              <span
                className="text-[9px] font-mono px-2 py-1 rounded-sm"
                style={{ color: '#64748B', background: '#1E2D4522' }}
              >
                {entry.run_id}
              </span>
            )}
          </div>

          {/* Metadata Row */}
          <div
            className="grid gap-3 text-[12px]"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}
          >
            {entry.harness && (
              <div>
                <div style={{ color: '#64748B' }}>Harness</div>
                <div style={{ color: '#E2E8F0' }}>{entry.harness}</div>
              </div>
            )}
            {entry.machine && (
              <div>
                <div style={{ color: '#64748B' }}>Machine</div>
                <div style={{ color: '#E2E8F0' }}>{entry.machine}</div>
              </div>
            )}
            {entry.tokens && entry.tokens !== 'unknown' && (
              <div>
                <div style={{ color: '#64748B' }}>Tokens</div>
                <div style={{ color: '#E2E8F0' }}>{entry.tokens}</div>
              </div>
            )}
            {entry.event && (
              <div>
                <div style={{ color: '#64748B' }}>Event Type</div>
                <div style={{ color: '#E2E8F0' }}>{entry.event}</div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div>
            <h3 style={{ color: '#64748B', fontSize: '11px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
              Summary
            </h3>
            <p style={{ color: '#E2E8F0', lineHeight: '1.6', fontSize: '13px' }}>
              {entry.summary}
            </p>
          </div>

          {/* Resume / Notes */}
          {entry.resume && (
            <div>
              <h3 style={{ color: '#64748B', fontSize: '11px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                Resume
              </h3>
              <p style={{ color: '#E2E8F0', lineHeight: '1.6', fontSize: '13px', fontFamily: "'Space Mono', monospace" }}>
                {entry.resume}
              </p>
            </div>
          )}

          {/* Files Changed */}
          {entry.files_changed && entry.files_changed.length > 0 && (
            <div>
              <h3 style={{ color: '#64748B', fontSize: '11px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                Files Changed ({entry.files_changed.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {entry.files_changed.map((file, i) => (
                  <div
                    key={i}
                    style={{
                      color: '#00D4FF',
                      fontSize: '12px',
                      fontFamily: "'Space Mono', monospace",
                      wordBreak: 'break-all',
                      paddingLeft: '12px',
                      borderLeft: '2px solid #1E2D45',
                    }}
                  >
                    {file}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Followups */}
          {entry.followups && entry.followups.length > 0 && (
            <div>
              <h3 style={{ color: '#64748B', fontSize: '11px', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>
                Followups ({entry.followups.length})
              </h3>
              <ul style={{ color: '#E2E8F0', fontSize: '12px', lineHeight: '1.8', paddingLeft: '20px' }}>
                {entry.followups.map((fup, i) => (
                  <li key={i} style={{ marginBottom: '6px' }}>
                    {fup}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Return to Dashboard */}
          <div style={{ paddingTop: '12px', borderTop: '1px solid #1E2D45' }}>
            <button
              onClick={onClose}
              className="text-[12px] font-semibold uppercase tracking-[0.1em] px-3 py-2 rounded-sm"
              style={{
                background: '#1E2D45',
                color: '#00D4FF',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Space Mono', monospace",
              }}
            >
              ← Back to Dashboard
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
